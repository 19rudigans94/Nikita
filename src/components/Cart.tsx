import { ShoppingCart, X } from 'lucide-react';
import { Game } from '../types';

interface CartProps {
  items: Game[];
  onRemove: (gameId: string) => void;
  onCheckout: () => void;
}

export default function Cart({ items, onRemove, onCheckout }: CartProps) {
  const total = items.reduce((sum, game) => sum + game.pricePerDay, 0);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ShoppingCart className="h-6 w-6 text-indigo-600" />
          <span className="ml-2 font-semibold">Your Cart</span>
        </div>
        <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-sm">
          {items.length}
        </span>
      </div>
      
      <div className="space-y-3 max-h-60 overflow-auto">
        {items.map((game) => (
          <div key={game.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{game.title}</p>
              <p className="text-sm text-gray-600">${game.pricePerDay}/day</p>
            </div>
            <button
              onClick={() => onRemove(game.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Total per day:</span>
          <span className="font-semibold">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}