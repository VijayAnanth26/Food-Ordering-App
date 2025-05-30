'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/restaurants/${id}/menu`);
        if (!res.ok) throw new Error('Failed to fetch menu');
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error(err);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white pt-8">
      <div className="max-w-5xl mx-auto p-6">
      <Link href="/restaurants" className="text-orange-500 hover:underline text-sm mb-4 inline-block">
  ← Back to Restaurants
</Link>
        <h1 className="text-4xl font-extrabold text-center text-orange-600 mb-10 drop-shadow">
          Menu {id ? `for Restaurant ID: ${id}` : ''}
        </h1>

        {loading ? (
          <p className="text-center text-gray-500 mt-12">Loading menu...</p>
        ) : menuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {menuItems.map((item) => (
              <div
                key={item._id?.toString()}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl border group"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  width={400}
                  height={208}
                />
                <div className="p-5">
                  <h2 className="text-xl font-bold text-orange-700">{item.name}</h2>
                  <p className="text-orange-600 font-medium mb-2">₹{item.price}</p>
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded transition"
                    onClick={() => addToCart(item, id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-12">
            No menu items available for this restaurant.
          </p>
        )}
      </div>
    </div>
  );
}
