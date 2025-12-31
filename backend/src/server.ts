import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import messageRoutes from './routes/messageRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import cannedResponseRoutes from './routes/cannedResponseRoutes.js';
import { initializeSocket } from './sockets/messageSocket.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { globalSearch } from './services/searchService.js';
import logger from './utils/logger.js';

const prisma = new PrismaClient();

const app = express();
const httpServer = createServer(app);

// CORS origins for different environments
const corsOrigins = process.env.NODE_ENV === 'production'
  ? [
    process.env.FRONTEND_URL || 'https://branch-abhinav.netlify.app',
    'https://branch-abhinav.netlify.app'
  ]
  : [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:4173'  // Production preview server
  ];

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: corsOrigins,
  credentials: true
}));
app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
});

// API Routes
app.use('/api/messages', messageRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/canned-responses', cannedResponseRoutes);

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { q, limit } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await globalSearch(
      q as string,
      limit ? parseInt(limit as string) : 20
    );

    res.json(results);
  } catch (error) {
    logger.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Conversations endpoint
app.get('/api/conversations', async (req, res) => {
  try {
    const { status, limit, offset } = req.query;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        customer: true,
        agent: true,
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          include: {
            customer: true
          }
        }
      },
      orderBy: { lastMessageAt: 'desc' },
      take: limit ? parseInt(limit as string) : 50,
      skip: offset ? parseInt(offset as string) : 0
    });

    // Calculate highest urgency for each conversation
    const conversationsWithUrgency = await Promise.all(
      conversations.map(async (conv) => {
        const highestUrgency = await prisma.message.findFirst({
          where: {
            conversationId: conv.id,
            direction: 'INBOUND'
          },
          orderBy: { urgencyScore: 'desc' },
          select: { urgencyLevel: true, urgencyScore: true }
        });

        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            status: 'UNREAD',
            direction: 'INBOUND'
          }
        });

        return {
          ...conv,
          highestUrgency: highestUrgency?.urgencyLevel || 'LOW',
          highestUrgencyScore: highestUrgency?.urgencyScore || 0,
          unreadCount
        };
      })
    );

    // Sort by urgency then by last message
    conversationsWithUrgency.sort((a, b) => {
      if (b.highestUrgencyScore !== a.highestUrgencyScore) {
        return b.highestUrgencyScore - a.highestUrgencyScore;
      }
      return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });

    res.json(conversationsWithUrgency);
  } catch (error) {
    logger.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get single conversation with all messages
app.get('/api/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: true,
        agent: true,
        messages: {
          orderBy: { timestamp: 'asc' },
          include: {
            agent: true
          }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    logger.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Dashboard stats
app.get('/api/stats', async (req, res) => {
  try {
    const [
      totalMessages,
      unreadMessages,
      criticalMessages,
      highMessages,
      totalConversations,
      openConversations,
      totalCustomers,
      totalAgents
    ] = await Promise.all([
      prisma.message.count(),
      prisma.message.count({ where: { status: 'UNREAD' } }),
      prisma.message.count({ where: { urgencyLevel: 'CRITICAL' } }),
      prisma.message.count({ where: { urgencyLevel: 'HIGH' } }),
      prisma.conversation.count(),
      prisma.conversation.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
      prisma.customer.count(),
      prisma.agent.count()
    ]);

    res.json({
      messages: {
        total: totalMessages,
        unread: unreadMessages,
        critical: criticalMessages,
        high: highMessages
      },
      conversations: {
        total: totalConversations,
        open: openConversations
      },
      customers: {
        total: totalCustomers
      },
      agents: {
        total: totalAgents
      }
    });
  } catch (error) {
    logger.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Initialize WebSocket
initializeSocket(io);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  logger.success(`🚀 Server running on port ${PORT}`);
  logger.info(`📡 WebSocket server ready`);
  logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

// Graceful shutdown
// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});