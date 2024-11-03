import { useState, useEffect } from 'react';
import { Game } from '../types';
import { gamesAPI } from '../services/api';

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadGames = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await gamesAPI.getAll();
      setGames(data);
    } catch (err) {
      setError('Failed to load games. Please try again later.');
      console.error('Error loading games:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  return {
    games,
    loading,
    error,
    reload: loadGames
  };
}