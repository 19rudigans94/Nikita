import express from 'express';
import { body } from 'express-validator';
import {
  createRental,
  getRentals,
  getRentalById,
  updateRentalStatus
} from '../controllers/rentalController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Create rental
router.post('/',
  [
    body('name').notEmpty().trim(),
    body('phone').matches(/^\d{10}$/).withMessage('Invalid phone number'),
    body('gameIds').isArray().notEmpty(),
    body('duration').isInt({ min: 1, max: 30 })
  ],
  validateRequest,
  createRental
);

// Get all rentals (admin only)
router.get('/', authenticateAdmin, getRentals);

// Get rental by ID (admin only)
router.get('/:id', authenticateAdmin, getRentalById);

// Update rental status (admin only)
router.patch('/:id/status',
  authenticateAdmin,
  [
    body('status').isIn(['pending', 'active', 'completed', 'cancelled'])
  ],
  validateRequest,
  updateRentalStatus
);

export { router as rentalRoutes };