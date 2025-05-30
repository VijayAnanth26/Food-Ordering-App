'use client';
import { createContext, useContext, useState } from 'react';

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status } : order
      )
    );
  };

  return (
    <OrdersContext.Provider value={{ orders, setOrders, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);
