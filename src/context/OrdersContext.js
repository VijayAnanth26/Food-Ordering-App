// "frontend/src/context/OrdersContext.js":
"use client";
import { createContext, useContext, useState } from "react";

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const placeOrder = (items, total, user, paymentMethod) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      items,
      total,
      date: new Date().toLocaleString(),
      status: 'Placed',
      userEmail: user.email,
      userRole: user.role,
      userCountry: user.country,
      paymentMethod: paymentMethod?.name || 'Not specified', // ✅ Save name
    };
  
    setOrders(prev => [...prev, newOrder]);
    return newOrder.id;
  };
  

  const cancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "Cancelled" } : order
      )
    );
  };

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, cancelOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);
