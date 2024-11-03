import { useState } from 'react';
import { Game } from '../types';

export function useCart() {
  const [cartItems, setCartItems] = useState<Game[]>([]);

  const addToCart = (game: Game) => {
    if (cartItems.some(item => item.id === game.id)) {
      alert('This game is already in your cart!');
      return;
    }
    setCartItems([...cartItems, game]);
  };

  const removeFromCart = (gameId: string) => {
    setCartItems(cartItems.filter(item => item.id !== gameId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart
  };
}