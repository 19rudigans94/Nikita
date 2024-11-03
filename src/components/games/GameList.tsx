import { useMemo } from 'react';
import { Game } from '../../types';
import GameCard from './GameCard';

interface GameListProps {
  games: Game[];
  selectedPlatform: string;
  searchQuery: string;
  onRent: (game: Game) => void;
}

export default function GameList({ games, selectedPlatform, searchQuery, onRent }: GameListProps) {
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesPlatform = !selectedPlatform || game.platform === selectedPlatform;
      const matchesSearch = !searchQuery || 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPlatform && matchesSearch;
    });
  }, [games, selectedPlatform, searchQuery]);

  if (filteredGames.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No games found matching your criteria. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredGames.map((game) => (
        <GameCard key={game.id} game={game} onRent={onRent} />
      ))}
    </div>
  );
}