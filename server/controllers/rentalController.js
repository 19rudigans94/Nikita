import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';
import { broadcast } from '../index.js';

const prisma = new PrismaClient();

export const createRental = async (req, res, next) => {
  try {
    const { name, phone, gameIds, duration } = req.body;
    
    // Check if all games are available
    const games = await prisma.game.findMany({
      where: {
        id: { in: gameIds },
        available: true
      }
    });
    
    if (games.length !== gameIds.length) {
      throw new ApiError(400, 'One or more games are not available');
    }
    
    // Create rental and update game availability
    const rental = await prisma.$transaction(async (tx) => {
      const rental = await tx.rental.create({
        data: {
          name,
          phone,
          duration,
          status: 'pending',
          games: {
            connect: gameIds.map(id => ({ id }))
          }
        },
        include: {
          games: true
        }
      });
      
      await tx.game.updateMany({
        where: { id: { in: gameIds } },
        data: { available: false }
      });
      
      return rental;
    });

    // Broadcast new rental notification
    broadcast({
      type: 'NEW_RENTAL',
      data: rental
    });
    
    res.status(201).json(rental);
  } catch (error) {
    next(error);
  }
};

export const getRentals = async (req, res, next) => {
  try {
    const rentals = await prisma.rental.findMany({
      include: {
        games: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(rentals);
  } catch (error) {
    next(error);
  }
};

export const getRentalById = async (req, res, next) => {
  try {
    const rental = await prisma.rental.findUnique({
      where: { id: req.params.id },
      include: {
        games: true
      }
    });
    
    if (!rental) {
      throw new ApiError(404, 'Rental not found');
    }
    
    res.json(rental);
  } catch (error) {
    next(error);
  }
};

export const updateRentalStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const rental = await prisma.$transaction(async (tx) => {
      const rental = await tx.rental.update({
        where: { id: req.params.id },
        data: { status },
        include: {
          games: true
        }
      });
      
      // If rental is completed or cancelled, make games available again
      if (status === 'completed' || status === 'cancelled') {
        await tx.game.updateMany({
          where: { id: { in: rental.games.map(g => g.id) } },
          data: { available: true }
        });
      }
      
      return rental;
    });

    // Broadcast rental status update
    broadcast({
      type: 'RENTAL_STATUS_UPDATED',
      data: rental
    });
    
    res.json(rental);
  } catch (error) {
    next(error);
  }
};