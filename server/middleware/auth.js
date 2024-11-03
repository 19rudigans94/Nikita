import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

export const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new ApiError(401, 'No authorization header');
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new ApiError(401, 'No token provided');
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded.isAdmin) {
        throw new ApiError(403, 'Admin access required');
      }
      
      // Add user info to request
      req.user = decoded;
      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, 'Token expired');
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, 'Invalid token');
      } else {
        throw jwtError;
      }
    }
  } catch (error) {
    next(error);
  }
};