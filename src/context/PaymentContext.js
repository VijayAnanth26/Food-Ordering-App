'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const res = await fetch('/api/payment-methods');
      const data = await res.json();
      setPaymentMethods(data);
    } catch (err) {
      console.error('Failed to load payment methods:', err);
    }
  };

  const addPaymentMethod = async (name) => {
    try {
      const res = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) fetchMethods();
    } catch (err) {
      console.error('Add payment method failed:', err);
    }
  };

  const removePaymentMethod = async (id) => {
    try {
      const res = await fetch('/api/payment-methods', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setPaymentMethods(prev => prev.filter(m => m._id !== id));
        if (selectedMethod?._id === id) setSelectedMethod(null);
      }
    } catch (err) {
      console.error('Delete payment method failed:', err);
    }
  };

  return (
    <PaymentContext.Provider value={{
      paymentMethods,
      addPaymentMethod,
      removePaymentMethod,
      selectedMethod,
      setSelectedMethod,
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
