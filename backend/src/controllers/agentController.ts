import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAgents(req: Request, res: Response) {
  try {
    const agents = await prisma.agent.findMany({
      include: {
        _count: {
          select: {
            messages: true,
            conversations: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
}

export async function getAgent(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const agent = await prisma.agent.findUnique({
      where: { id: parseInt(id) },
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 10
        },
        conversations: {
          orderBy: { lastMessageAt: 'desc' },
          take: 10,
          include: {
            customer: true
          }
        }
      }
    });

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
}

export async function createAgent(req: Request, res: Response) {
  try {
    const { name, email, status } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }

    const agent = await prisma.agent.create({
      data: {
        name,
        email,
        status: status || 'AVAILABLE'
      }
    });

    res.status(201).json(agent);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Agent with this email already exists' });
    }
    console.error('Error creating agent:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
}

export async function updateAgentStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const agent = await prisma.agent.update({
      where: { id: parseInt(id) },
      data: {
        status,
        lastActiveAt: new Date()
      }
    });

    res.json(agent);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Agent not found' });
    }
    console.error('Error updating agent status:', error);
    res.status(500).json({ error: 'Failed to update agent status' });
  }
}

export async function getAgentStats(req: Request, res: Response) {
  try {
    const [total, available, busy, offline] = await Promise.all([
      prisma.agent.count(),
      prisma.agent.count({ where: { status: 'AVAILABLE' } }),
      prisma.agent.count({ where: { status: 'BUSY' } }),
      prisma.agent.count({ where: { status: 'OFFLINE' } })
    ]);

    res.json({ total, available, busy, offline });
  } catch (error) {
    console.error('Error fetching agent stats:', error);
    res.status(500).json({ error: 'Failed to fetch agent stats' });
  }
}

export async function getAgentConversations(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.query;

    const where: any = {
      agentId: parseInt(id)
    };

    if (status) {
      where.status = status;
    }

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        customer: true,
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    });

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching agent conversations:', error);
    res.status(500).json({ error: 'Failed to fetch agent conversations' });
  }
}
