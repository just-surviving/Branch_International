import { PrismaClient, UrgencyLevel, MessageStatus } from '@prisma/client';
import { detectUrgency } from './urgencyDetectionService.js';

const prisma = new PrismaClient();

export interface CreateMessageInput {
  customerId: number;
  conversationId?: number;
  content: string;
  direction: 'INBOUND' | 'OUTBOUND';
  agentId?: number;
}

export interface MessageFilters {
  urgencyLevel?: UrgencyLevel;
  status?: MessageStatus;
  customerId?: number;
  conversationId?: number;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export async function getAllMessages(filters: MessageFilters = {}) {
  const where: any = {};

  if (filters.urgencyLevel) {
    where.urgencyLevel = filters.urgencyLevel;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.customerId) {
    where.customerId = filters.customerId;
  }

  if (filters.conversationId) {
    where.conversationId = filters.conversationId;
  }

  if (filters.startDate || filters.endDate) {
    where.timestamp = {};
    if (filters.startDate) {
      where.timestamp.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.timestamp.lte = filters.endDate;
    }
  }

  const messages = await prisma.message.findMany({
    where,
    include: {
      customer: true,
      agent: true,
      conversation: true
    },
    orderBy: { timestamp: 'desc' },
    take: filters.limit || 100,
    skip: filters.offset || 0
  });

  return messages;
}

export async function getMessageById(id: number) {
  return prisma.message.findUnique({
    where: { id },
    include: {
      customer: true,
      agent: true,
      conversation: true
    }
  });
}

export async function createMessage(input: CreateMessageInput) {
  const urgency = detectUrgency(input.content);

  // Find or create conversation
  let conversationId = input.conversationId;
  
  if (!conversationId) {
    const conversation = await prisma.conversation.findFirst({
      where: {
        customerId: input.customerId,
        status: { in: ['OPEN', 'IN_PROGRESS'] }
      }
    });

    if (conversation) {
      conversationId = conversation.id;
    } else {
      const newConversation = await prisma.conversation.create({
        data: {
          customerId: input.customerId,
          lastMessageAt: new Date(),
          status: 'OPEN'
        }
      });
      conversationId = newConversation.id;
    }
  }

  const message = await prisma.message.create({
    data: {
      customerId: input.customerId,
      conversationId,
      content: input.content,
      direction: input.direction,
      urgencyScore: input.direction === 'INBOUND' ? urgency.score : 1,
      urgencyLevel: input.direction === 'INBOUND' ? urgency.level : 'LOW',
      agentId: input.agentId,
      timestamp: new Date(),
      status: input.direction === 'INBOUND' ? 'UNREAD' : 'REPLIED'
    },
    include: {
      customer: true,
      agent: true,
      conversation: true
    }
  });

  // Update conversation
  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      lastMessageAt: new Date(),
      status: input.agentId ? 'IN_PROGRESS' : 'OPEN',
      agentId: input.agentId || undefined
    }
  });

  return message;
}

export async function updateMessageStatus(id: number, status: MessageStatus) {
  return prisma.message.update({
    where: { id },
    data: { status }
  });
}

export async function getMessagesByConversation(conversationId: number) {
  return prisma.message.findMany({
    where: { conversationId },
    include: {
      customer: true,
      agent: true
    },
    orderBy: { timestamp: 'asc' }
  });
}

export async function getMessageStats() {
  const [total, unread, critical, high] = await Promise.all([
    prisma.message.count(),
    prisma.message.count({ where: { status: 'UNREAD' } }),
    prisma.message.count({ where: { urgencyLevel: 'CRITICAL' } }),
    prisma.message.count({ where: { urgencyLevel: 'HIGH' } })
  ]);

  return { total, unread, critical, high };
}
