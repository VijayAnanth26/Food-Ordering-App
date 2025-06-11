'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter, Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
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
  const t = useTranslations('common.navbar');
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  // Calculate total items in cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (href) => pathname === href;
  const navLinkClass = (href) =>
    `flex items-center gap-1 px-3 py-2 rounded-md transition-all duration-200 hover:bg-orange-600 ${isActive(href) ? 'font-medium text-white bg-orange-600' : 'text-white'}`;

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

  const handleCartClick = () => {
    router.push('/cart', { locale });
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold tracking-tight hover:text-white group flex items-center gap-2">
            <span className="text-white group-hover:scale-105 transition-transform duration-200">Fury Foods</span>
            <span className="hidden sm:inline-block text-sm bg-orange-300 text-orange-800 px-2 py-0.5 rounded-full font-semibold">Delicious</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/" className={navLinkClass('/')}>
              <HomeIcon className="w-5 h-5" />
              {t('home')}
            </Link>
            <Link href="/restaurants" className={navLinkClass('/restaurants')}>
              <BuildingStorefrontIcon className="w-5 h-5" />
              {t('restaurants')}
            </Link>
            <Link href="/orders" className={navLinkClass('/orders')}>
              <ClipboardDocumentListIcon className="w-5 h-5" />
              {t('orders')}
            </Link>

            {/* Cart */}
            {user && (
              <button
                onClick={handleCartClick}
                className="relative flex items-center gap-1 px-3 py-2 rounded-md transition-all duration-200 hover:bg-orange-600 focus:outline-none"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                <span>{t('cart')}</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-orange-600 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md transition-all duration-200 hover:bg-orange-600 focus:outline-none"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span className="max-w-[120px] truncate">{user.email}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-gray-700 rounded-md shadow-xl z-10 overflow-hidden">
                    <div className="px-4 py-3 border-b border-orange-100 bg-orange-50">
                      <p className="text-sm font-semibold text-orange-800">{user.role.toUpperCase()}</p>
                      {user.country && <p className="text-xs text-orange-600">{user.country}</p>}
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-orange-50 text-gray-700 transition-colors duration-200"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Squares2X2Icon className="w-5 h-5 text-orange-600" />
                      {t('dashboard')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-3 hover:bg-orange-50 text-gray-700 transition-colors duration-200"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5 text-orange-600" />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-md hover:bg-orange-100 transition-colors duration-200 font-semibold shadow-sm"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                {t('login')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="text-white p-2 rounded-md hover:bg-orange-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
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
        <div className="md:hidden bg-orange-600 text-white px-4 py-4 shadow-lg divide-y divide-orange-500">
          {/* Language Switcher */}
          <div className="py-3 flex justify-center">
            <LanguageSwitcher />
          </div>

          <div className="py-3">
            <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-3 hover:text-orange-200 transition-colors duration-200">
              <HomeIcon className="w-5 h-5" />
              {t('home')}
            </Link>
            <Link href="/restaurants" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-3 hover:text-orange-200 transition-colors duration-200">
              <BuildingStorefrontIcon className="w-5 h-5" />
              {t('restaurants')}
            </Link>
            <Link href="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-3 hover:text-orange-200 transition-colors duration-200">
              <ClipboardDocumentListIcon className="w-5 h-5" />
              {t('orders')}
            </Link>
          </div>

          {user && (
            <div className="py-3">
              <button
                onClick={handleCartClick}
                className="flex w-full items-center justify-between gap-2 px-3 py-3 rounded hover:bg-orange-700 transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <ShoppingCartIcon className="w-5 h-5" />
                  {t('cart')}
                </div>
                {totalItems > 0 && (
                  <span className="bg-white text-orange-600 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-3 rounded hover:bg-orange-700 transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                <Squares2X2Icon className="w-5 h-5" />
                {t('dashboard')}
              </Link>
            </div>
          )}

          <div className="py-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 bg-white text-orange-600 px-4 py-3 rounded-md font-medium"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                {t('logout')}
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-white text-orange-600 px-4 py-3 rounded-md font-medium"
                onClick={() => setMenuOpen(false)}
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
