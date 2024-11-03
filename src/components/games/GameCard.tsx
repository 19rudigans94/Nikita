import { Game } from '../../types';

interface GameCardProps {
  game: Game;
  onRent: (game: Game) => void;
}

export default function GameCard({ game, onRent }: GameCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <img
        src={game.imageUrl}
        alt={game.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
        <p className="text-gray-600 mb-4">{game.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-indigo-600 font-bold">
            ${game.pricePerDay}/day
          </span>
          <button
            onClick={() => onRent(game)}
            className={`px-4 py-2 rounded-md transition-colors ${
              game.available
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!game.available}
          >
            {game.available ? 'Rent Now' : 'Not Available'}
          </button>
        </div>
        <div className="mt-2">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
            {game.platform}
          </span>
        </div>
      </div>
    </div>
  );
}