import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SearchFilters {
  urgencyLevel?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

export async function searchMessages(query: string, filters: SearchFilters = {}) {
  const lowerQuery = query.toLowerCase();
  
  const where: any = {
    OR: [
      { content: { contains: query, mode: 'insensitive' } },
      { customer: { name: { contains: query, mode: 'insensitive' } } },
      { customer: { email: { contains: query, mode: 'insensitive' } } }
    ]
  };

  if (filters.urgencyLevel) {
    where.urgencyLevel = filters.urgencyLevel;
  }

  if (filters.status) {
    where.status = filters.status;
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
    take: filters.limit || 50
  });

  return messages;
}

export async function searchCustomers(query: string, limit: number = 20) {
  const customers = await prisma.customer.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } },
        { userId: { equals: isNaN(parseInt(query)) ? undefined : parseInt(query) } }
      ]
    },
    include: {
      messages: {
        orderBy: { timestamp: 'desc' },
        take: 1
      },
      conversations: {
        orderBy: { lastMessageAt: 'desc' },
        take: 1
      }
    },
    take: limit
  });

  return customers;
}

export async function searchConversations(query: string, limit: number = 20) {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { customer: { name: { contains: query, mode: 'insensitive' } } },
        { customer: { email: { contains: query, mode: 'insensitive' } } },
        { messages: { some: { content: { contains: query, mode: 'insensitive' } } } }
      ]
    },
    include: {
      customer: true,
      agent: true,
      messages: {
        orderBy: { timestamp: 'desc' },
        take: 1
      }
    },
    orderBy: { lastMessageAt: 'desc' },
    take: limit
  });

  return conversations;
}

export async function globalSearch(query: string, limit: number = 20) {
  const [messages, customers, conversations] = await Promise.all([
    searchMessages(query, { limit }),
    searchCustomers(query, limit),
    searchConversations(query, limit)
  ]);

  return {
    messages,
    customers,
    conversations,
    totalResults: messages.length + customers.length + conversations.length
  };
}
