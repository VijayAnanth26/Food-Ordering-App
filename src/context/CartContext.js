'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  // Load cart from MongoDB if user is logged in; else from sessionStorage
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const res = await fetch('/api/cart', {
            headers: { 'user-id': user._id }
          });
          const dbCart = await res.json();
          setCart(dbCart);
        } catch (error) {
          console.error('Failed to load cart from DB:', error);
        }
      } else {
        const savedCart = sessionStorage.getItem('cart');
        if (savedCart) setCart(JSON.parse(savedCart));
      }
    };

    loadCart();
  }, [user]);

  // Sync cart to sessionStorage if not logged in
  useEffect(() => {
    if (!user) {
      sessionStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  // Sync to MongoDB when cart or user changes
  useEffect(() => {
    const syncWithMongo = async () => {
      if (!user) return;

      try {
        await fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'user-id': user._id },
        });

        for (const item of cart) {
          await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'user-id': user._id
            },
            body: JSON.stringify({ ...item, userId: user._id }),
          });
        }
      } catch (err) {
        console.error('Failed to sync cart with MongoDB:', err);
      }
    };

    if (user) {
      syncWithMongo();
    }
  }, [cart, user]);

  // Add item to cart
  const addToCart = useCallback((item, restaurantId) => {
    setCart((prev) => {
      if (prev.length > 0 && prev[0].restaurantId !== restaurantId) {
        alert("You can only order from one restaurant at a time.");
        return prev;
      }

      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, restaurantId, quantity: 1 }];
      }
    });
  }, []);

  const incrementQuantity = useCallback((itemId) => {
    setCart(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decrementQuantity = useCallback((itemId) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    if (confirm("Are you sure you want to clear the cart?")) {
      setCart([]);
      if (user) {
        fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'user-id': user._id }
        }).catch(console.error);
      } else {
        sessionStorage.removeItem('cart');
      }
    }
  }, [user]);

  // Clear cart on logout
  useEffect(() => {
    if (!user) {
      setCart([]);
      sessionStorage.removeItem('cart');
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
