import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { detectUrgency } from '../services/urgencyDetectionService.js';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

interface AgentSocket extends Socket {
  agentId?: number;
  agentName?: string;
}

interface ConnectedAgent {
  socketId: string;
  agentId: number;
  agentName: string;
  joinedAt: Date;
}

export function initializeSocket(io: Server) {
  const connectedAgents = new Map<number, ConnectedAgent>();

  io.on('connection', (socket: AgentSocket) => {
    logger.socket(`Client connected: ${socket.id}`);

    // Send current agent count on connect
    socket.emit('agents:count', connectedAgents.size);

    // Agent joins
    socket.on('agent:join', async (data: { agentId: number; agentName?: string }) => {
      const { agentId, agentName } = data;
      
      socket.agentId = agentId;
      socket.agentName = agentName;
      
      connectedAgents.set(agentId, {
        socketId: socket.id,
        agentId,
        agentName: agentName || `Agent ${agentId}`,
        joinedAt: new Date()
      });

      try {
        // Update agent status in database
        await prisma.agent.update({
          where: { id: agentId },
          data: { status: 'AVAILABLE', lastActiveAt: new Date() }
        });
      } catch (error) {
        logger.error(`Failed to update agent ${agentId} status:`, error);
      }

      // Broadcast agent count to all clients
      io.emit('agents:count', connectedAgents.size);
      io.emit('agents:list', Array.from(connectedAgents.values()));

      logger.socket(`Agent ${agentId} (${agentName}) joined. Total agents: ${connectedAgents.size}`);
    });

    // New message from customer
    socket.on('message:new', async (data: {
      customerId: number;
      userId: number;
      conversationId?: number;
      content: string;
    }) => {
      try {
        logger.socket(`New message from customer ${data.userId}: ${data.content.substring(0, 50)}...`);

        // Find or create customer
        let customer = await prisma.customer.findUnique({
          where: { userId: data.userId }
        });

        if (!customer) {
          customer = await prisma.customer.create({
            data: {
              userId: data.userId,
              name: `Customer ${data.userId}`,
              email: `customer${data.userId}@example.com`,
              accountStatus: 'active'
            }
          });
        }

        // Detect urgency
        const urgency = detectUrgency(data.content);

        // Find or create conversation
        let conversation = await prisma.conversation.findFirst({
          where: {
            customerId: customer.id,
            status: { in: ['OPEN', 'IN_PROGRESS'] }
          }
        });

        if (!conversation) {
          conversation = await prisma.conversation.create({
            data: {
              customerId: customer.id,
              lastMessageAt: new Date(),
              status: 'OPEN'
            }
          });
        }

        // Create message
        const message = await prisma.message.create({
          data: {
            customerId: customer.id,
            conversationId: conversation.id,
            content: data.content,
            direction: 'INBOUND',
            urgencyScore: urgency.score,
            urgencyLevel: urgency.level,
            timestamp: new Date(),
            status: 'UNREAD'
          },
          include: {
            customer: true,
            conversation: true
          }
        });

        // Update conversation timestamp
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: { lastMessageAt: new Date() }
        });

        // Broadcast to all agents
        io.emit('message:received', {
          ...message,
          urgencyKeywords: urgency.keywords
        });

        logger.socket(`Message ${message.id} broadcast to ${connectedAgents.size} agents`);
      } catch (error) {
        logger.error('Error creating message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Agent sends reply
    socket.on('message:reply', async (data: {
      customerId: number;
      conversationId: number;
      content: string;
    }) => {
      try {
        if (!socket.agentId) {
          socket.emit('error', { message: 'Agent not authenticated' });
          return;
        }

        logger.socket(`Reply from agent ${socket.agentId}: ${data.content.substring(0, 50)}...`);

        const message = await prisma.message.create({
          data: {
            customerId: data.customerId,
            conversationId: data.conversationId,
            content: data.content,
            direction: 'OUTBOUND',
            agentId: socket.agentId,
            urgencyScore: 1,
            urgencyLevel: 'LOW',
            timestamp: new Date(),
            status: 'REPLIED'
          },
          include: {
            customer: true,
            agent: true,
            conversation: true
          }
        });

        // Update conversation
        await prisma.conversation.update({
          where: { id: data.conversationId },
          data: {
            lastMessageAt: new Date(),
            status: 'IN_PROGRESS',
            agentId: socket.agentId
          }
        });

        // Mark previous unread messages as read
        await prisma.message.updateMany({
          where: {
            conversationId: data.conversationId,
            direction: 'INBOUND',
            status: 'UNREAD'
          },
          data: { status: 'READ' }
        });

        // Broadcast to all clients
        io.emit('message:sent', message);

        logger.socket(`Reply sent by agent ${socket.agentId} to conversation ${data.conversationId}`);
      } catch (error) {
        logger.error('Error sending reply:', error);
        socket.emit('error', { message: 'Failed to send reply' });
      }
    });

    // Agent typing indicator
    socket.on('agent:typing', (data: { conversationId: number }) => {
      socket.broadcast.emit('agent:typing', {
        agentId: socket.agentId,
        agentName: socket.agentName,
        conversationId: data.conversationId
      });
    });

    // Agent stopped typing
    socket.on('agent:stopped-typing', (data: { conversationId: number }) => {
      socket.broadcast.emit('agent:stopped-typing', {
        agentId: socket.agentId,
        conversationId: data.conversationId
      });
    });

    // Mark message as read
    socket.on('message:read', async (messageId: number) => {
      try {
        await prisma.message.update({
          where: { id: messageId },
          data: { status: 'READ' }
        });

        io.emit('message:status', { messageId, status: 'READ' });
      } catch (error) {
        logger.error('Error marking message as read:', error);
      }
    });

    // Resolve conversation
    socket.on('conversation:resolve', async (conversationId: number) => {
      try {
        await prisma.conversation.update({
          where: { id: conversationId },
          data: {
            status: 'RESOLVED',
            resolvedAt: new Date()
          }
        });

        // Mark all messages as resolved
        await prisma.message.updateMany({
          where: { conversationId },
          data: { status: 'RESOLVED' }
        });

        io.emit('conversation:resolved', { conversationId });

        logger.socket(`Conversation ${conversationId} resolved by agent ${socket.agentId}`);
      } catch (error) {
        logger.error('Error resolving conversation:', error);
      }
    });

    // Agent disconnect
    socket.on('disconnect', async () => {
      if (socket.agentId) {
        connectedAgents.delete(socket.agentId);

        try {
          await prisma.agent.update({
            where: { id: socket.agentId },
            data: { status: 'OFFLINE' }
          });
        } catch (error) {
          logger.error(`Failed to update agent ${socket.agentId} status on disconnect:`, error);
        }

        io.emit('agents:count', connectedAgents.size);
        io.emit('agents:list', Array.from(connectedAgents.values()));

        logger.socket(`Agent ${socket.agentId} disconnected. Total agents: ${connectedAgents.size}`);
      } else {
        logger.socket(`Client disconnected: ${socket.id}`);
      }
    });
  });

  logger.info('WebSocket server initialized');
}
