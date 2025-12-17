import { Router } from 'express';
import {
  getMessages,
  getMessage,
  createMessage,
  replyToMessage,
  updateMessageStatus,
  getMessageStats,
  analyzeUrgency
} from '../controllers/messageController.js';

const router = Router();

// Get all messages with optional filters
router.get('/', getMessages);

// Get message stats
router.get('/stats', getMessageStats);

// Analyze urgency of content
router.post('/analyze-urgency', analyzeUrgency);

// Get single message by ID
router.get('/:id', getMessage);

// Create new message
router.post('/', createMessage);

// Reply to a message
router.post('/:id/reply', replyToMessage);

// Update message status
router.patch('/:id/status', updateMessageStatus);

export default router;
