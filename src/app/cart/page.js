'use client';

import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrdersContext';
import { useAuth } from '@/context/AuthContext';
import { usePayment } from '@/context/PaymentContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, incrementQuantity, decrementQuantity, clearCart, total } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const { paymentMethods, selectedMethod, setSelectedMethod } = usePayment();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!selectedMethod) {
      alert('Please select a payment method.');
      return;
    }
  
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user._id
        },
        body: JSON.stringify({
          userId: user._id,
          items: cart,
          paymentMethod: selectedMethod,
          total
        }),
      });
  
      if (!res.ok) throw new Error('Failed to place order');
  
      const newOrder = await res.json();
      router.push(`/orders?newOrderId=${newOrder._id}`);
  
      // Simulate delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
  
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-orange-700 mb-6">Your Cart</h1>

        {cart.length > 0 && (
          <p className="text-gray-500 mb-4">
            Ordering from: <span className="font-semibold">{cart[0].restaurantName}</span>
          </p>
        )}

        {cart.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        ) : (
          <>
            <ul className="space-y-4 mb-6">
              {cart.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div>
                    <p className="font-semibold text-lg text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                    <div className="flex space-x-2 mt-1">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >−</button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >+</button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Select Payment Method:
              </label>
              <select
  value={selectedMethod?.name || ""}
  onChange={(e) => {
    const selected = paymentMethods.find(m => m.name === e.target.value);
    setSelectedMethod(selected);
  }}
>
  <option value="">Select payment method</option>
  {paymentMethods.map((method) => (
    <option key={method._id} value={method.name}>
      {method.name}
    </option>
  ))}
</select>

            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-700">Total</span>
              <span className="text-xl font-bold text-orange-700">₹{total}</span>
            </div>

            <p className="text-sm text-gray-500 mb-2">Estimated delivery: 30–45 minutes</p>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full ${loading ? 'bg-orange-400' : 'bg-orange-600 hover:bg-orange-700'} text-white text-lg font-semibold py-3 rounded-lg transition duration-200`}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
