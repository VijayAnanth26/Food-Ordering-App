// frontend/src/app/cart/page.js
'use client';

import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrdersContext';
import { useAuth } from '@/context/AuthContext';
import { usePayment } from '@/context/PaymentContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const { paymentMethods, selectedMethod, setSelectedMethod } = usePayment();
  const router = useRouter();

  const handlePlaceOrder = () => {
    if (!selectedMethod) {
      alert('Please select a payment method.');
      return;
    }
    const orderId = placeOrder(cart, total, user, selectedMethod); // ✅ Pass method
    clearCart();
    router.push(`/orders?newOrderId=${orderId}`);
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-700 mb-6">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <ul className="space-y-4 mb-6">
              {cart.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Select Payment Method:</label>
              <select
                value={selectedMethod?.id || ''}
                onChange={(e) =>
                  setSelectedMethod(paymentMethods.find(m => m.id === e.target.value))
                }
                className="border px-4 py-2 rounded w-full"
              >
                <option value="">-- Select a payment method --</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-right font-bold text-lg text-orange-700 mb-4">
              Total: ₹{total}
            </div>

            <button
              onClick={handlePlaceOrder}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
            >
              Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}
