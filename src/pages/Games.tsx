import { useState } from 'react';
import { Game } from '../types';
import { useGames } from '../hooks/useGames';
import { useCart } from '../hooks/useCart';
import GameList from '../components/games/GameList';
import GameFilters from '../components/games/GameFilters';
import RentalForm from '../components/rental/RentalForm';
import Cart from '../components/cart/Cart';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Container from '../components/common/Container';

export default function Games() {
  const { games, loading, error, reload } = useGames();
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Games</h1>
      
      <GameFilters
        games={games}
        selectedPlatform={selectedPlatform}
        searchQuery={searchQuery}
        onPlatformChange={setSelectedPlatform}
        onSearchChange={setSearchQuery}
      />

      <GameList
        games={games}
        selectedPlatform={selectedPlatform}
        searchQuery={searchQuery}
        onRent={addToCart}
      />
      
      <Cart
        items={cartItems}
        onRemove={removeFromCart}
        onCheckout={() => setSelectedGame(cartItems[0])}
      />
      
      {selectedGame && (
        <RentalForm
          game={selectedGame}
          cartItems={cartItems}
          onSubmit={async () => {
            setSelectedGame(null);
            clearCart();
            await reload();
          }}
          onCancel={() => setSelectedGame(null)}
        />
      )}
    </Container>
  );
}