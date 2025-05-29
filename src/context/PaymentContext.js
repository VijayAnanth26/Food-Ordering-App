'use client';
import { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'pm1', name: 'Credit Card' },
    { id: 'pm2', name: 'UPI' },
  ]);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const addPaymentMethod = (name) => {
    setPaymentMethods(prev => [
      ...prev,
      { id: `pm${prev.length + 1}`, name },
    ]);
  };

  const removePaymentMethod = (id) => {
    setPaymentMethods(prev => prev.filter(m => m.id !== id));
    if (selectedMethod?.id === id) setSelectedMethod(null);
  };

  return (
    <PaymentContext.Provider
      value={{
        paymentMethods,
        addPaymentMethod,
        removePaymentMethod,
        selectedMethod,
        setSelectedMethod,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
