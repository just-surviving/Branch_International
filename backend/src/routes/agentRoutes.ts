import { Router } from 'express';
import {
  getAgents,
  getAgent,
  createAgent,
  updateAgentStatus,
  getAgentStats,
  getAgentConversations
} from '../controllers/agentController.js';

const router = Router();

// Get all agents
router.get('/', getAgents);

// Get agent stats
router.get('/stats', getAgentStats);

// Get single agent
router.get('/:id', getAgent);

// Get agent's conversations
router.get('/:id/conversations', getAgentConversations);

// Create new agent
router.post('/', createAgent);

// Update agent status
router.patch('/:id/status', updateAgentStatus);

export default router;
