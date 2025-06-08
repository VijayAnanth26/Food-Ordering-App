'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch both restaurant details and menu items in one request
        const res = await fetch(`/api/restaurants/${id}/menu`);
        if (!res.ok) throw new Error('Failed to fetch restaurant data');
        
        const data = await res.json();
        setRestaurant(data.restaurant);
        setMenuItems(data.menuItems || []);
      } catch (err) {
        console.error(err);
        setMenuItems([]);
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  const handleAddToCart = (item) => {
    if (!restaurant) return;
    
    // Add restaurant details to the item
    const itemWithRestaurant = {
      ...item,
      restaurantId: restaurant.id || restaurant._id,
      restaurantName: restaurant.name,
    };
    
    addToCart(itemWithRestaurant);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white pt-8">
      <div className="max-w-6xl mx-auto p-6">
        <Link
          href="/restaurants"
          className="text-orange-500 hover:underline text-sm mb-6 inline-block"
        >
          ← Back to Restaurants
        </Link>

        <h1 className="text-4xl font-extrabold text-center text-orange-600 mb-12 drop-shadow">
          {restaurant?.name || 'Restaurant Menu'}
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md p-4 animate-pulse h-72"
              >
                <div className="bg-gray-200 h-40 w-full rounded mb-4"></div>
                <div className="bg-gray-200 h-4 w-2/3 mb-2 rounded"></div>
                <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
              </div>
            ))}
          </div>
        ) : menuItems.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item._id?.toString() || `menu-item-${index}`}
                className="bg-white rounded-2xl shadow-md border group hover:shadow-xl transition-transform transform hover:scale-[1.03] duration-300"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div className="relative w-full h-52 rounded-t-2xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  />
                </div>

                <div className="p-5">
                  <h2 className="text-2xl font-semibold text-orange-800 mb-1">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {item.description || 'Delicious and freshly prepared.'}
                  </p>
                  <span className="inline-block bg-orange-100 text-orange-600 text-sm font-medium px-3 py-1 rounded-full mb-4">
                    ₹{item.price}
                  </span>
                  <button
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-full transition-all duration-300"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500 mt-12">
            No menu items available for this restaurant.
          </p>
        )}
      </div>
    </div>
  );
}
