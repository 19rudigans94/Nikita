import { api } from './config';
import { Game } from '../../types';

export const gamesAPI = {
  getAll: async (): Promise<Game[]> => {
    try {
      const response = await api.get<Game[]>('/games');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch games');
    }
  },

  getById: async (id: string): Promise<Game> => {
    try {
      const response = await api.get<Game>(`/games/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch game details');
    }
  },

  create: async (gameData: Omit<Game, 'id'>): Promise<Game> => {
    try {
      const response = await api.post<Game>('/games', gameData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create game');
    }
  },

  update: async (id: string, gameData: Partial<Game>): Promise<Game> => {
    try {
      const response = await api.put<Game>(`/games/${id}`, gameData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update game');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/games/${id}`);
    } catch (error) {
      throw new Error('Failed to delete game');
    }
  },
};