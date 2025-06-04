'use client';

import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrdersContext';
import { useAuth } from '@/context/AuthContext';
import { usePayment } from '@/context/PaymentContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, incrementQuantity, decrementQuantity, clearCart, total } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const { paymentMethods, selectedMethod, setSelectedMethod } = usePayment();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const canPlaceOrder = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return role === 'admin' || role === 'manager';
  }, [user]);

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
          'user-id': user._id,
        },
        body: JSON.stringify({
          userId: user._id,
          items: cart,
          paymentMethod: selectedMethod,
          total,
        }),
      });

      if (!res.ok) throw new Error('Failed to place order');

      const newOrder = await res.json();
      router.push(`/orders?newOrderId=${newOrder._id}`);

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-xl transition-all duration-300">
        <h1 className="text-4xl font-bold text-orange-700 mb-6 text-center">Your Cart</h1>

        {cart.length > 0 && (
          <p className="text-center text-gray-600 mb-6">
            Ordering from: <span className="font-semibold text-gray-800">{cart[0].restaurantName}</span>
          </p>
        )}

        {cart.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">Your cart is empty.</p>
        ) : (
          <>
            <ul className="space-y-5 mb-8">
              {cart.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4"
                >
                  <div className="w-full">
                    <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
                      >−</button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
                      >+</button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:underline font-medium text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
              <select
                value={selectedMethod?.name || ""}
                onChange={(e) => {
                  const selected = paymentMethods.find(m => m.name === e.target.value);
                  setSelectedMethod(selected);
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              >
                <option value="">Select payment method</option>
                {paymentMethods.map((method) => (
                  <option key={method._id} value={method.name}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between items-center text-lg font-semibold text-gray-800 mb-4">
              <span>Total:</span>
              <span className="text-orange-700 text-xl">₹{total}</span>
            </div>

            <p className="text-sm text-gray-500 mb-6 text-center">Estimated delivery: 30–45 minutes</p>

            {!canPlaceOrder && (
              <p className="text-red-600 text-sm mb-4 text-center">
                You do not have permission to place orders. Only Admins and Managers can perform this action.
              </p>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !canPlaceOrder}
              className={`w-full py-3 text-white text-lg font-semibold rounded-lg transition-all duration-200 ${
                loading || !canPlaceOrder
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
