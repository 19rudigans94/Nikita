import axios, { AxiosError } from 'axios';
import { Game, RentalOrder } from '../types';

// Use environment variable or default to localhost in development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
    }
    
    // Enhance error message for client
    const message = error.response?.data?.error || error.message;
    return Promise.reject(new Error(message));
  }
);

interface LoginResponse {
  token: string;
  isAdmin: boolean;
}

interface TokenValidationResponse {
  valid: boolean;
  isAdmin: boolean;
}

export const authAPI = {
  login: async (password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', { password });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Invalid credentials');
        }
        throw new Error(error.response?.data?.error || 'Login failed');
      }
      throw new Error('Login failed. Please try again later.');
    }
  },

  validateToken: async (): Promise<TokenValidationResponse> => {
    try {
      const response = await api.post<TokenValidationResponse>('/auth/validate');
      return response.data;
    } catch (error) {
      return { valid: false, isAdmin: false };
    }
  },
};

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

interface RentalResponse extends RentalOrder {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const rentalsAPI = {
  create: async (rentalData: Omit<RentalOrder, 'games'> & { gameIds: string[] }): Promise<RentalResponse> => {
    try {
      const response = await api.post<RentalResponse>('/rentals', rentalData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create rental');
    }
  },

  getAll: async (): Promise<RentalResponse[]> => {
    try {
      const response = await api.get<RentalResponse[]>('/rentals');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch rentals');
    }
  },

  getById: async (id: string): Promise<RentalResponse> => {
    try {
      const response = await api.get<RentalResponse>(`/rentals/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch rental details');
    }
  },

  updateStatus: async (id: string, status: string): Promise<RentalResponse> => {
    try {
      const response = await api.patch<RentalResponse>(`/rentals/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update rental status');
    }
  },
};