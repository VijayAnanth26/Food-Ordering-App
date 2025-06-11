'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

export default function AuthGuard({ children }) {
  const t = useTranslations('common');
  const { user, loading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const [isClient, setIsClient] = useState(false);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      try {
        router.push('/login');
      } catch (error) {
        setAuthError(true);
        console.error('Error redirecting to login page:', error);
      }
    }
  }, [user, loading, router, locale]);

  // Show loading state while checking auth
  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white shadow-lg rounded-lg max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-orange-100 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-orange-200 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-orange-300 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-orange-400 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 h-24 w-24 rounded-full border-t-4 border-orange-500 animate-spin"></div>
            </div>
            <h2 className="mt-6 text-xl font-semibold text-orange-700">{t('auth.verifying')}</h2>
            <p className="mt-2 text-gray-500 text-center">{t('auth.pleaseWait')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if we couldn't redirect properly
  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white shadow-lg rounded-lg max-w-md w-full text-center">
          <div className="inline-flex h-20 w-20 rounded-full bg-red-100 items-center justify-center mb-4">
            <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">{t('auth.error')}</h2>
          <p className="text-gray-600 mb-6">{t('auth.errorMessage')}</p>
          <Link
            href="/login"
            className="inline-block bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            {t('auth.tryAgain')}
          </Link>
        </div>
      </div>
    );
  }

  // If we have a user, show the children
  if (user) {
    return <>{children}</>;
  }

  // If we don't have a user, show a message
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="p-8 bg-white shadow-xl rounded-lg max-w-md w-full text-center border border-orange-100">
        <div className="inline-flex h-20 w-20 rounded-full bg-orange-100 items-center justify-center mb-4">
          <svg className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-orange-600 mb-4">{t('auth.required')}</h2>
        <p className="text-gray-600 mb-6">
          {t('auth.loginNeeded')}
        </p>
        <Link
          href="/login"
          className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-md"
        >
          {t('auth.goToLogin')}
        </Link>
      </div>
    </div>
  );
}
