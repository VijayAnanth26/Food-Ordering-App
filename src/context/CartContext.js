'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item, restaurantId) => {
    if (cart.length > 0 && cart[0].restaurantId !== restaurantId) {
      alert("You can only order from one restaurant at a time.");
      return;
    }

    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
      setCart(cart.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, restaurantId, quantity: 1 }]);
    }
  }, [cart]);

  const incrementQuantity = useCallback((itemId) => {
    setCart(cart.map(item =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  }, [cart]);

  const decrementQuantity = useCallback((itemId) => {
    setCart(
      cart
        .map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  }, [cart]);

  const removeFromCart = useCallback(async (itemId) => {
    try {
      await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: { 'user-id': user?._id },
      });
      setCart(cart.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  }, [cart, user]);

  const clearCart = useCallback(() => {
    if (confirm("Are you sure you want to clear the cart?")) {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      // If user is null (logged out), clear cart automatically
      setCart([]);
      localStorage.removeItem('cart');
    }
  }, [user]);
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        incrementQuantity,
        decrementQuantity,
        removeFromCart,
        clearCart,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
