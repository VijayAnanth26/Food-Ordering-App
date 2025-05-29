// frontend/src/app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-white pt-16 min-h-screen">
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/symphony.png')]"></div>
      <div className="pt-16 pb-32 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="text-5xl font-extrabold tracking-tight text-orange-600 sm:text-7xl drop-shadow-lg">
              Welcome to <span className="text-orange-400">Fury Foods</span>
            </h1>
            <p className="mt-6 text-2xl text-gray-700">
              A Role & Country based Food Ordering Platform powered by Nick Fury and his team. Discover local restaurants, order meals, and manage your orders — all in one place.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/restaurants"
                className="inline-flex items-center rounded-md bg-orange-600 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-orange-700 transition"
              >
                <span>Browse Restaurants</span>
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
          {/* Decorative food image grid with animation */}
          <div className="mt-10 animate-fadeInUp">
            <div
              aria-hidden="true"
              className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
            >
              <div className="absolute transform sm:top-0 sm:left-1/2 sm:translate-x-8 lg:top-1/2 lg:left-1/2 lg:translate-x-8 lg:-translate-y-1/2">
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                    <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100 transition-transform hover:scale-105">
                      <img
                        alt="Food 1"
                        src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="h-64 w-44 overflow-hidden rounded-lg transition-transform hover:scale-105">
                      <img
                        alt="Food 2"
                        src="https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg"
                        className="size-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                    <div className="h-64 w-44 overflow-hidden rounded-lg transition-transform hover:scale-105">
                      <img
                        alt="Food 3"
                        src="https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="h-64 w-44 overflow-hidden rounded-lg transition-transform hover:scale-105">
                      <img
                        alt="Food 4"
                        src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="h-64 w-44 overflow-hidden rounded-lg transition-transform hover:scale-105">
                      <img
                        alt="Food 5"
                        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                        className="size-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                    <div className="h-64 w-44 overflow-hidden rounded-lg transition-transform hover:scale-105">
                      <img
                        alt="Food 6"
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="h-64 w-44 overflow-hidden rounded-lg transition-transform hover:scale-105">
                      <img
                        alt="Food 7"
                        src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                        className="size-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
