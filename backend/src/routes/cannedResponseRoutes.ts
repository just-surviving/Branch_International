import { Router } from 'express';
import {
  getCannedResponses,
  getCannedResponse,
  createCannedResponse,
  updateCannedResponse,
  deleteCannedResponse,
  getCannedResponseCategories
} from '../controllers/cannedResponseController.js';

const router = Router();

// Get all canned responses
router.get('/', getCannedResponses);

// Get all categories
router.get('/categories', getCannedResponseCategories);

// Get single canned response
router.get('/:id', getCannedResponse);

// Create new canned response
router.post('/', createCannedResponse);

// Update canned response
router.patch('/:id', updateCannedResponse);

// Delete canned response
router.delete('/:id', deleteCannedResponse);

export default router;
