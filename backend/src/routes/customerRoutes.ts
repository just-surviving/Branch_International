import { Router } from 'express';
import {
  getCustomers,
  getCustomer,
  getCustomerByUserId,
  createCustomer,
  updateCustomer,
  getCustomerStats
} from '../controllers/customerController.js';

const router = Router();

// Get all customers
router.get('/', getCustomers);

// Get customer stats
router.get('/stats', getCustomerStats);

// Get customer by internal ID
router.get('/:id', getCustomer);

// Get customer by User ID (from CSV)
router.get('/user/:userId', getCustomerByUserId);

// Create new customer
router.post('/', createCustomer);

// Update customer
router.patch('/:id', updateCustomer);

export default router;
