'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href) => pathname === href;
  const navLinkClass = (href) =>
    `flex items-center gap-1 hover:text-orange-200 ${isActive(href) ? 'underline underline-offset-4' : ''}`;

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-orange-500 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold tracking-tight hover:text-orange-200">
            Fury Foods
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className={navLinkClass('/')}>
              <HomeIcon className="w-5 h-5" />
              Home
            </Link>
            <Link href="/restaurants" className={navLinkClass('/restaurants')}>
              <BuildingStorefrontIcon className="w-5 h-5" />
              Restaurants
            </Link>
            <Link href="/orders" className={navLinkClass('/orders')}>
              <ClipboardDocumentListIcon className="w-5 h-5" />
              Orders
            </Link>

            {/* Cart */}
            {user && (
              <button
                onClick={() => router.push('/cart')}
                className="relative flex items-center gap-1 hover:text-orange-200 focus:outline-none"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                <span>Cart ({cart.length})</span>
              </button>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 cursor-pointer hover:text-orange-200 focus:outline-none"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span>{user.email}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-orange-700 rounded shadow-lg z-10">
                    <div className="px-4 py-2 border-b border-orange-200">
                      <p className="text-sm font-semibold">{user.role.toUpperCase()}</p>
                      {user.country && <p className="text-xs text-orange-600">{user.country}</p>}
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-orange-100 hover:text-orange-600"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Squares2X2Icon className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-orange-100 hover:text-orange-600"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-white text-orange-500 px-4 py-1 rounded hover:bg-orange-100 hover:text-orange-700 font-semibold"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-orange-600 text-white px-4 py-3 space-y-3">
          <Link href="/" onClick={() => setMenuOpen(false)} className={navLinkClass('/')}>
            <HomeIcon className="w-5 h-5" />
            Home
          </Link>
          <Link href="/restaurants" onClick={() => setMenuOpen(false)} className={navLinkClass('/restaurants')}>
            <BuildingStorefrontIcon className="w-5 h-5" />
            Restaurants
          </Link>
          <Link href="/orders" onClick={() => setMenuOpen(false)} className={navLinkClass('/orders')}>
            <ClipboardDocumentListIcon className="w-5 h-5" />
            Orders
          </Link>

          {user && (
            <>
              <button
                onClick={() => {
                  router.push('/cart');
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 bg-orange-700 px-3 py-2 rounded hover:bg-orange-800"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                Cart ({cart.length})
              </button>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-orange-700 px-3 py-2 rounded hover:bg-orange-800"
                onClick={() => setMenuOpen(false)}
              >
                <Squares2X2Icon className="w-5 h-5" />
                Dashboard
              </Link>
              <div className="border-t border-orange-500 pt-2">
                <p className="text-sm">{user.email}</p>
                <p className="text-xs italic mb-2">{user.role.toUpperCase()}</p>
                {user.country && <p className="text-xs italic mb-2">{user.country}</p>}
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-white text-orange-600 px-3 py-1 rounded hover:bg-orange-100"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </>
          )}

          {!user && (
            <Link
              href="/login"
              className="flex items-center gap-2 bg-white text-orange-500 px-3 py-1 rounded justify-center hover:bg-orange-100"
              onClick={() => setMenuOpen(false)}
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
