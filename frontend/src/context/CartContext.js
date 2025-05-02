// frontend/src/context/CartContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import shopAPI from '../services/shopAPI';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Clear cart when logged out
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await shopAPI.getCart();
      if (response.data.success) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (artworkId, quantity = 1) => {
    try {
      setLoading(true);
      const response = await shopAPI.addToCart(artworkId, quantity);
      if (response.data.success) {
        setCart(response.data.cart);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart({ items: [], totalItems: 0, totalPrice: 0 });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        fetchCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;