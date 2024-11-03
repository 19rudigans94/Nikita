import { api } from './config';
import { AxiosError } from 'axios';

interface LoginResponse {
  token: string;
  isAdmin: boolean;
  expiresIn: string;
}

interface TokenValidationResponse {
  valid: boolean;
  isAdmin: boolean;
  expiresAt?: number;
}

interface SetupCheckResponse {
  needsSetup: boolean;
}

export const authAPI = {
  login: async (password: string, isInitialSetup = false): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', { 
        password,
        isInitialSetup 
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Invalid credentials');
        }
        if (error.response?.status === 400) {
          throw new Error(error.response.data.error || 'Invalid request');
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
      console.error('Token validation error:', error);
      return { valid: false, isAdmin: false };
    }
  },

  checkSetup: async (): Promise<SetupCheckResponse> => {
    try {
      const response = await api.get<SetupCheckResponse>('/auth/check-setup');
      return response.data;
    } catch (error) {
      console.error('Setup check error:', error);
      throw new Error('Failed to check setup status');
    }
  },
};