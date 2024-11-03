import { api } from './config';
import { RentalOrder } from '../../types';

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