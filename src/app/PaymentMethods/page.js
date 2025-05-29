'use client';
import { useAuth } from '@/context/AuthContext';
import { usePayment } from '@/context/PaymentContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PaymentPage() {
  const { user } = useAuth();
  const {
    paymentMethods,
    addPaymentMethod,
    removePaymentMethod,
  } = usePayment();
  const [newMethod, setNewMethod] = useState('');
  const router = useRouter();

  if (!user) {
    router.push('/login');
    return null;
  }

  if (user.role !== 'Admin') {
    return <p className="text-red-500">Access denied: Only Admins can manage payment methods.</p>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Payment Methods</h1>

      <ul className="mb-4 space-y-2">
        {paymentMethods.map((method) => (
          <li key={method.id} className="flex justify-between items-center bg-white p-3 shadow rounded">
            <span>{method.name}</span>
            <button
              onClick={() => removePaymentMethod(method.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New payment method"
          value={newMethod}
          onChange={(e) => setNewMethod(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={() => {
            if (!newMethod.trim()) return;
            addPaymentMethod(newMethod.trim());
            setNewMethod('');
          }}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}
