'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
        const { role, country } = storedUser;

        if (!role || !country) {
          console.warn('Incomplete user data.');
          return;
        }

        setUser(storedUser);

        const response = await fetch('/api/restaurants');
        const data = await response.json();

        const filteredRestaurants =
          role === 'Admin'
            ? data
            : data.filter(r => r.location?.toLowerCase() === country.toLowerCase());

        setRestaurants(filteredRestaurants);
      } catch (err) {
        console.error('Error loading restaurants:', err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white pt-8">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-center text-orange-600 mb-10 drop-shadow">
          {user ? `Restaurants for ${user.role}` : 'Loading...'}
        </h1>

        {restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map(({ _id, name, cuisine, city, image }, index) => (
              <Link
                key={_id.toString()}
                href={`/restaurants/${_id.toString()}`}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1 overflow-hidden border border-orange-100 group"
                aria-label={`View ${name}`}
              >
                <Image
                  src={image}
                  alt={name}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  width={800}
                  height={416}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 3}
                />
                <div className="p-5">
                  <h2 className="text-2xl font-bold text-orange-700 mb-2">{name}</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                      {cuisine}
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {city}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">Click to view menu</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-12">No restaurants available in your region.</p>
        )}
      </div>
    </div>
  );
}
