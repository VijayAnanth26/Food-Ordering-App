// "frontend/src/app/orders/page.js":
'use client';

import { useOrders } from '@/context/OrdersContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function OrdersPage() {
  const { orders, cancelOrder } = useOrders();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Filter orders based on user's role and country
  const filteredOrders = useMemo(() => {
    if (!user) return [];
    
    // Admin can see all orders
    if (user.role === 'Admin') return orders;
    
    // Managers and Members can only see orders from their country
    return orders.filter(order => order.userCountry === user.country);
  }, [orders, user]);

  // Check if user can cancel orders
  const canCancelOrder = useMemo(() => {
    if (!user) return false;
    return user.role === 'Admin' || user.role.startsWith('Manager');
  }, [user]);

  const handleCancelOrder = (orderId) => {
    if (!canCancelOrder) {
      alert('Only Admin and Managers can cancel orders.');
      return;
    }

    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(orderId);
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-orange-700">Your Orders</h1>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Role:</span> {user.role}
            {user.country && (
              <span className="ml-4">
                <span className="font-medium">Country:</span> {user.country}
              </span>
            )}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-500">Date: {order.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === 'Placed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
  <p>
    <span className="font-medium text-gray-800">User:</span> {order.userEmail}
  </p>
  <p>
    <span className="font-medium text-gray-800">Role:</span> {order.userRole}
  </p>
  <p>
    <span className="font-medium text-gray-800">Country:</span> {order.userCountry}
  </p>
  <p>
    <span className="font-medium text-gray-800">Payment Method:</span>{' '}
    {order.paymentMethod || 'N/A'}
  </p>
</div>


                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold mb-2">Items:</h3>
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>₹{item.price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-right font-bold">
                      Total: <span className="text-orange-600">₹{order.total}</span>
                    </p>
                  </div>
                </div>

                {canCancelOrder && order.status === 'Placed' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}