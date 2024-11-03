import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ApiError } from '../utils/ApiError.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const JWT_EXPIRY = '24h';

export const checkSetup = async (req, res, next) => {
  try {
    const storedHash = process.env.ADMIN_PASSWORD_HASH;
    const needsSetup = !storedHash || storedHash === 'SETUP_REQUIRED';
    res.json({ needsSetup });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { password, isInitialSetup } = req.body;
    
    if (!password) {
      throw new ApiError(400, 'Password is required');
    }

    // Get hash from environment variable
    let storedHash = process.env.ADMIN_PASSWORD_HASH?.replace(/^["'](.*)["']$/, '$1');
    
    if (!storedHash && !isInitialSetup) {
      throw new ApiError(400, 'Initial setup required');
    }

    if (isInitialSetup) {
      if (storedHash && storedHash !== 'SETUP_REQUIRED') {
        throw new ApiError(400, 'Admin account already exists');
      }

      // Validate password requirements
      if (password.length < 8) {
        throw new ApiError(400, 'Password must be at least 8 characters long');
      }

      // Create new admin password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      
      // Update .env file
      const envPath = join(__dirname, '../../.env');
      let envContent = await fs.readFile(envPath, 'utf-8');
      const escapedHash = hash.replace(/\$/g, '\\$');
      envContent = envContent.replace(
        /ADMIN_PASSWORD_HASH=.*/,
        `ADMIN_PASSWORD_HASH="${escapedHash}"`
      );
      await fs.writeFile(envPath, envContent);
      
      // Update environment variable
      process.env.ADMIN_PASSWORD_HASH = hash;
      storedHash = hash;

      console.log('Initial admin setup completed');
    }

    // For both initial setup and regular login, verify password
    const isValid = await bcrypt.compare(password, storedHash);
    
    if (!isValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Create token
    const token = jwt.sign(
      { isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    
    res.json({ token, isAdmin: true });
  } catch (error) {
    next(error);
  }
};

export const validateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.json({ valid: false, isAdmin: false });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ 
        valid: true,
        isAdmin: decoded.isAdmin,
        expiresAt: decoded.exp * 1000 // Convert to milliseconds
      });
    } catch (jwtError) {
      res.json({ 
        valid: false,
        isAdmin: false,
        error: jwtError instanceof jwt.TokenExpiredError ? 'Token expired' : 'Invalid token'
      });
    }
  } catch (error) {
    next(error);
  }
};