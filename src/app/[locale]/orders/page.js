'use client';

import { useOrders } from '@/context/OrdersContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function OrdersPage() {
  const t = useTranslations('common.orders');
  const locale = useLocale();
  const { orders, setOrders, updateOrderStatus } = useOrders();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [restaurantDetails, setRestaurantDetails] = useState({});

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/login`);
    }
  }, [user, router, locale]);

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

  // Fetch restaurant details for orders
  useEffect(() => {
    async function fetchRestaurantDetails() {
      const restaurantIds = new Set();
      
      // Collect unique restaurant IDs
      orders.forEach(order => {
        if (order.restaurantId) {
          restaurantIds.add(order.restaurantId);
        }
      });
      
      // Fetch details for each restaurant
      const details = {};
      await Promise.all([...restaurantIds].map(async (id) => {
        try {
          const res = await fetch(`/api/restaurants/${id}/menu?type=restaurant_only`);
          if (res.ok) {
            const data = await res.json();
            details[id] = data;
          }
        } catch (error) {
          console.error(`Error fetching restaurant ${id}:`, error);
        }
      }));
      
      setRestaurantDetails(details);
    }
    
    if (orders.length > 0) {
      fetchRestaurantDetails();
    }
  }, [orders]);

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
      alert(t('onlyAdminCancel'));
      return;
    }
  
    if (window.confirm(t('confirmCancel'))) {
      try {
        const res = await fetch(`/api/orders/${orderId}/cancel`, {
          method: 'PUT',
        });
  
        if (!res.ok) {
          throw new Error('Failed to cancel on server');
        }
  
        updateOrderStatus(orderId, 'Cancelled');
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert(t('cancelError'));
      }
    }
  };
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-orange-700">{t('title')}</h1>
          <div className="text-sm text-gray-600 text-right">
            <div><span className="font-medium">{t('role')}:</span> {user.role}</div>
            {user.country && (
              <div><span className="font-medium">{t('country')}:</span> {user.country}</div>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-gray-500 text-center">{t('noOrders')}</p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const restaurant = restaurantDetails[order.restaurantId] || null;
              return (
                <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-gray-400">{t('orderId')}: {order._id}</p>
                      <p className="text-xs text-gray-400">{t('date')}: {new Date(order.createdAt).toLocaleString(locale)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status?.toLowerCase() === 'ordered'
                        ? 'bg-green-100 text-green-800'
                        : order.status?.toLowerCase() === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status?.toLowerCase() === 'ordered' ? t('status.ordered') : 
                       order.status?.toLowerCase() === 'cancelled' ? t('status.cancelled') : order.status}
                    </span>
                  </div>

                  {/* Restaurant Details */}
                  {restaurant && (
                    <div className="mb-4 p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        {restaurant.image && (
                          <div className="relative w-16 h-16 overflow-hidden rounded-lg flex-shrink-0">
                            <Image
                              src={restaurant.image}
                              alt={restaurant.name}
                              fill
                              className="object-cover"
                              sizes="4rem"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-orange-700">{restaurant.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {restaurant.cuisine && (
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                {restaurant.cuisine}
                              </span>
                            )}
                            {restaurant.city && (
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                {restaurant.city}
                              </span>
                            )}
                          </div>
                          {restaurant.address && (
                            <p className="text-xs text-gray-600 mt-1">{restaurant.address}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-700 space-y-1 mb-4">
                    <p><span className="font-medium">{t('user')}:</span> {order.userEmail}</p>
                    <p><span className="font-medium">{t('role')}:</span> {order.userRole}</p>
                    <p><span className="font-medium">{t('country')}:</span> {order.userCountry}</p>
                    <p><span className="font-medium">{t('payment')}:</span> {order.paymentMethod?.name || "N/A"}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{t('items')}:</h3>
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
                      {t('total')}: ₹{order.total}
                    </p>
                  </div>

                  {canCancelOrder && order.status?.toLowerCase() === 'ordered' && (
                    <div className="mt-4 pt-4 border-t">
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors text-sm font-medium"
                      >
                        {t('cancelOrder')}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
