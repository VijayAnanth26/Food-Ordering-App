'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false); // ✅ Track if cart has been initialized
  const { user, loading } = useAuth();

  // Clear session storage on login
  useEffect(() => {
    if (user && sessionStorage.getItem('cart')) {
      sessionStorage.removeItem('cart');
    }
  }, [user]);

  // Load cart from DB or sessionStorage
  useEffect(() => {
    if (loading) return;

    const loadCart = async () => {
      if (user && user._id) {
        try {
          const res = await fetch('/api/cart', {
            headers: {
              'user-id': user._id,
              'user-role': user.role,
              'user-country': user.country,
            },
          });
          if (res.ok) {
            const dbCart = await res.json();
            setCart(dbCart);
          }
        } catch (error) {
          console.error('Failed to load cart from DB:', error);
        }
      } else {
        const savedCart = sessionStorage.getItem('cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      }

      setCartLoaded(true); // ✅ Mark cart as loaded
    };

    loadCart();
  }, [user, loading]);

  // Save to sessionStorage for guest users
  useEffect(() => {
    if (!user) {
      sessionStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  // Sync to MongoDB only after cart is loaded
  useEffect(() => {
    const syncWithMongo = async () => {
      if (!user?._id || !cartLoaded) return;

      try {
        await fetch('/api/cart', {
          method: 'DELETE',
          headers: {
            'user-id': user._id,
            'user-role': user.role,
            'user-country': user.country,
          },
        });

        for (const item of cart) {
          await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'user-id': user._id,
              'user-role': user.role,
              'user-country': user.country,
            },
            body: JSON.stringify(item),
          });
        }
      } catch (err) {
        console.error('Failed to sync cart with MongoDB:', err);
      }
    };

    syncWithMongo();
  }, [cart, user, cartLoaded]); // ✅ Only run if cart is fully loaded

  // Helper to get current restaurant ID
  const getCartRestaurantId = useCallback(() => {
    return cart[0]?.restaurantId ?? null;
  }, [cart]);

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      // Check restaurant ID match
      const currentRestaurantId = getCartRestaurantId();
      if (currentRestaurantId && currentRestaurantId !== item.restaurantId) {
        alert('You can only order from one restaurant at a time.');
        return prev;
      }

      const existingItem = prev.find((i) => i.id === item.id || i._id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          (i.id === item.id || i._id === item.id)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, [getCartRestaurantId]);

  const incrementQuantity = useCallback((itemId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decrementQuantity = useCallback((itemId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);

    if (user?._id) {
      fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'user-id': user._id,
          'user-role': user.role,
          'user-country': user.country,
        },
      }).catch(console.error);
    } else {
      sessionStorage.removeItem('cart');
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
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
