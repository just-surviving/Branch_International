import { Request, Response, NextFunction } from 'express';

export function validateMessage(req: Request, res: Response, next: NextFunction) {
  const { content } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Message content is required and must be a string' });
  }

  if (content.length > 10000) {
    return res.status(400).json({ error: 'Message content must be less than 10000 characters' });
  }

  next();
}

export function validateId(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: 'Valid ID is required' });
  }

  next();
}

export function validateCustomer(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.body;

  if (!userId || typeof userId !== 'number') {
    return res.status(400).json({ error: 'userId is required and must be a number' });
  }

  next();
}

export function validateAgent(req: Request, res: Response, next: NextFunction) {
  const { name, email } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Agent name is required' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  next();
}
