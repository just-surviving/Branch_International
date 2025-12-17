import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as messageService from '../services/messageService.js';
import { detectUrgency } from '../services/urgencyDetectionService.js';

const prisma = new PrismaClient();

export async function getMessages(req: Request, res: Response) {
  try {
    const { urgencyLevel, status, customerId, conversationId, limit, offset } = req.query;

    const filters: messageService.MessageFilters = {
      urgencyLevel: urgencyLevel as any,
      status: status as any,
      customerId: customerId ? parseInt(customerId as string) : undefined,
      conversationId: conversationId ? parseInt(conversationId as string) : undefined,
      limit: limit ? parseInt(limit as string) : 100,
      offset: offset ? parseInt(offset as string) : 0
    };

    const messages = await messageService.getAllMessages(filters);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

export async function getMessage(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const message = await messageService.getMessageById(parseInt(id));

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
}

export async function createMessage(req: Request, res: Response) {
  try {
    const { customerId, content, conversationId } = req.body;

    if (!customerId || !content) {
      return res.status(400).json({ error: 'customerId and content are required' });
    }

    // Check if customer exists, create if not
    let customer = await prisma.customer.findUnique({
      where: { userId: customerId }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          userId: customerId,
          name: `Customer ${customerId}`,
          email: `customer${customerId}@example.com`,
          accountStatus: 'active'
        }
      });
    }

    const message = await messageService.createMessage({
      customerId: customer.id,
      conversationId: conversationId ? parseInt(conversationId) : undefined,
      content,
      direction: 'INBOUND'
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
}

export async function replyToMessage(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { content, agentId } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'content is required' });
    }

    const originalMessage = await messageService.getMessageById(parseInt(id));

    if (!originalMessage) {
      return res.status(404).json({ error: 'Original message not found' });
    }

    // Mark original message as replied
    await messageService.updateMessageStatus(parseInt(id), 'REPLIED');

    // Create reply message
    const reply = await messageService.createMessage({
      customerId: originalMessage.customerId,
      conversationId: originalMessage.conversationId || undefined,
      content,
      direction: 'OUTBOUND',
      agentId: agentId ? parseInt(agentId) : undefined
    });

    res.status(201).json(reply);
  } catch (error) {
    console.error('Error replying to message:', error);
    res.status(500).json({ error: 'Failed to reply to message' });
  }
}

export async function updateMessageStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const message = await messageService.updateMessageStatus(parseInt(id), status);
    res.json(message);
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ error: 'Failed to update message status' });
  }
}

export async function getMessageStats(req: Request, res: Response) {
  try {
    const stats = await messageService.getMessageStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching message stats:', error);
    res.status(500).json({ error: 'Failed to fetch message stats' });
  }
}

export async function analyzeUrgency(req: Request, res: Response) {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'content is required' });
    }

    const urgency = detectUrgency(content);
    res.json(urgency);
  } catch (error) {
    console.error('Error analyzing urgency:', error);
    res.status(500).json({ error: 'Failed to analyze urgency' });
  }
}
