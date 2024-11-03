import express from 'express';
import { body } from 'express-validator';
import { login, validateToken, checkSetup } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.get('/check-setup', checkSetup);

router.post('/login',
  [
    body('password').notEmpty(),
    body('isInitialSetup').optional().isBoolean()
  ],
  validateRequest,
  login
);

router.post('/validate', validateToken);

export { router as authRoutes };