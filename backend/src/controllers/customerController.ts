import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCustomers(req: Request, res: Response) {
  try {
    const { limit, offset, search } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1
        },
        conversations: {
          orderBy: { lastMessageAt: 'desc' },
          take: 1,
          include: {
            messages: {
              orderBy: { timestamp: 'desc' },
              take: 1
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit ? parseInt(limit as string) : 50,
      skip: offset ? parseInt(offset as string) : 0
    });

    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
}

export async function getCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(id) },
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 20
        },
        conversations: {
          orderBy: { lastMessageAt: 'desc' },
          include: {
            messages: {
              orderBy: { timestamp: 'asc' }
            },
            agent: true
          }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
}

export async function getCustomerByUserId(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { userId: parseInt(userId) },
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 20
        },
        conversations: {
          orderBy: { lastMessageAt: 'desc' },
          include: {
            messages: {
              orderBy: { timestamp: 'asc' }
            },
            agent: true
          }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
}

export async function createCustomer(req: Request, res: Response) {
  try {
    const { userId, name, email, phone, accountStatus, creditScore, accountAge, loanStatus } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const customer = await prisma.customer.create({
      data: {
        userId,
        name: name || `Customer ${userId}`,
        email: email || `customer${userId}@example.com`,
        phone,
        accountStatus: accountStatus || 'active',
        creditScore,
        accountAge,
        loanStatus
      }
    });

    res.status(201).json(customer);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Customer with this userId already exists' });
    }
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
}

export async function updateCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, email, phone, accountStatus, creditScore, accountAge, loanStatus } = req.body;

    const customer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        accountStatus,
        creditScore,
        accountAge,
        loanStatus
      }
    });

    res.json(customer);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Customer not found' });
    }
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
}

export async function getCustomerStats(req: Request, res: Response) {
  try {
    const [total, active, withLoans] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { accountStatus: 'active' } }),
      prisma.customer.count({ where: { loanStatus: 'Active' } })
    ]);

    res.json({ total, active, withLoans });
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    res.status(500).json({ error: 'Failed to fetch customer stats' });
  }
}
