import express from 'express';
import { body } from 'express-validator';
import { 
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame
} from '../controllers/gameController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all games
router.get('/', getGames);

// Get game by ID
router.get('/:id', getGameById);

// Create new game (admin only)
router.post('/',
  authenticateAdmin,
  [
    body('title').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('imageUrl').isURL(),
    body('pricePerDay').isFloat({ min: 0 }),
    body('platform').isIn(['PS5', 'Xbox Series X', 'Nintendo Switch']),
    body('available').isBoolean()
  ],
  validateRequest,
  createGame
);

// Update game (admin only)
router.put('/:id',
  authenticateAdmin,
  [
    body('title').optional().trim(),
    body('description').optional().trim(),
    body('imageUrl').optional().isURL(),
    body('pricePerDay').optional().isFloat({ min: 0 }),
    body('platform').optional().isIn(['PS5', 'Xbox Series X', 'Nintendo Switch']),
    body('available').optional().isBoolean()
  ],
  validateRequest,
  updateGame
);

// Delete game (admin only)
router.delete('/:id', authenticateAdmin, deleteGame);

export { router as gameRoutes };