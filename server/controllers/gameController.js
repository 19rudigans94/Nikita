import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn']
});

export const getGames = async (req, res, next) => {
  try {
    console.log('Fetching all games...');
    const games = await prisma.game.findMany({
      orderBy: { title: 'asc' }
    });
    console.log(`Found ${games.length} games`);
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    next(error);
  }
};

export const getGameById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Fetching game with ID: ${id}`);
    
    const game = await prisma.game.findUnique({
      where: { id }
    });
    
    if (!game) {
      throw new ApiError(404, 'Game not found');
    }
    
    res.json(game);
  } catch (error) {
    console.error('Error fetching game by ID:', error);
    next(error);
  }
};

export const createGame = async (req, res, next) => {
  try {
    console.log('Creating new game:', req.body);
    const game = await prisma.game.create({
      data: req.body
    });
    console.log('Game created:', game);
    res.status(201).json(game);
  } catch (error) {
    console.error('Error creating game:', error);
    next(error);
  }
};

export const updateGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Updating game ${id}:`, req.body);
    
    const game = await prisma.game.update({
      where: { id },
      data: req.body
    });
    
    console.log('Game updated:', game);
    res.json(game);
  } catch (error) {
    console.error('Error updating game:', error);
    next(error);
  }
};

export const deleteGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Deleting game ${id}`);
    
    await prisma.game.delete({
      where: { id }
    });
    
    console.log('Game deleted successfully');
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting game:', error);
    next(error);
  }
};