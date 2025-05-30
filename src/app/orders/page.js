'use client';

import { useOrders } from '@/context/OrdersContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function OrdersPage() {
  const { orders, setOrders, updateOrderStatus } = useOrders();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user?._id) return;
      try {
        const res = await fetch("/api/orders", {
          headers: {
            "user-id": user._id,
            "Content-Type": "application/json"
          },
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchOrders();
  }, [user, setOrders]);

  const filteredOrders = useMemo(() => {
    if (!user) return [];
    if (user.role?.toLowerCase() === 'admin') return orders;
    return orders.filter((order) => order.userCountry === user.country);
  }, [orders, user]);

  const canCancelOrder = useMemo(() => {
    if (!user) return false;
    const role = user.role?.toLowerCase();
    return role === 'admin' || role.startsWith('manager');
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (!canCancelOrder) {
      alert('Only Admin and Managers can cancel orders.');
      return;
    }

    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        // Backend DELETE not implemented yet — mock update
        updateOrderStatus(orderId, 'Cancelled');
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order. Please try again.');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-orange-700">Your Orders</h1>
          <div className="text-sm text-gray-600 text-right">
            <div><span className="font-medium">Role:</span> {user.role}</div>
            {user.country && (
              <div><span className="font-medium">Country:</span> {user.country}</div>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-gray-500 text-center">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Order ID: {order._id}</p>
                    <p className="text-xs text-gray-400">Date: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status?.toLowerCase() === 'ordered'
                      ? 'bg-green-100 text-green-800'
                      : order.status?.toLowerCase() === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1).toLowerCase()}
                  </span>
                </div>

                <div className="text-sm text-gray-700 space-y-1 mb-4">
                  <p><span className="font-medium">User:</span> {order.userEmail}</p>
                  <p><span className="font-medium">Role:</span> {order.userRole}</p>
                  <p><span className="font-medium">Country:</span> {order.userCountry}</p>
                  <p><span className="font-medium">Payment:</span> {order.paymentMethod || 'N/A'}</p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Items:</h3>
                  {order.items && order.items.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {order.items.map((item, index) => (
                        <li key={`${order._id}-${index}`} className="flex justify-between text-gray-700">
                          <span>{item.name} × {item.quantity || 1}</span>
                          <span>₹{item.price * (item.quantity || 1)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No items in this order.</p>
                  )}
                  <p className="text-right text-lg font-bold text-orange-700 mt-4">
                    Total: ₹{order.total}
                  </p>
                </div>

                {canCancelOrder && order.status?.toLowerCase() === 'ordered' && (
                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors text-sm font-medium"
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
