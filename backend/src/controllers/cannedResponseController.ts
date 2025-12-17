import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCannedResponses(req: Request, res: Response) {
  try {
    const { category } = req.query;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    const responses = await prisma.cannedResponse.findMany({
      where,
      orderBy: [{ category: 'asc' }, { title: 'asc' }]
    });

    res.json(responses);
  } catch (error) {
    console.error('Error fetching canned responses:', error);
    res.status(500).json({ error: 'Failed to fetch canned responses' });
  }
}

export async function getCannedResponse(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const response = await prisma.cannedResponse.findUnique({
      where: { id: parseInt(id) }
    });

    if (!response) {
      return res.status(404).json({ error: 'Canned response not found' });
    }

    res.json(response);
  } catch (error) {
    console.error('Error fetching canned response:', error);
    res.status(500).json({ error: 'Failed to fetch canned response' });
  }
}

export async function createCannedResponse(req: Request, res: Response) {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'title, content, and category are required' });
    }

    const response = await prisma.cannedResponse.create({
      data: {
        title,
        content,
        category
      }
    });

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating canned response:', error);
    res.status(500).json({ error: 'Failed to create canned response' });
  }
}

export async function updateCannedResponse(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const response = await prisma.cannedResponse.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        category
      }
    });

    res.json(response);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Canned response not found' });
    }
    console.error('Error updating canned response:', error);
    res.status(500).json({ error: 'Failed to update canned response' });
  }
}

export async function deleteCannedResponse(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.cannedResponse.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Canned response deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Canned response not found' });
    }
    console.error('Error deleting canned response:', error);
    res.status(500).json({ error: 'Failed to delete canned response' });
  }
}

export async function getCannedResponseCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.cannedResponse.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' }
    });

    res.json(categories.map(c => c.category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}
