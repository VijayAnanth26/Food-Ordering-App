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

  useEffect(() => {
    setIsClient(true);
    
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      // Use plain 'login' path and let next-intl handle locale
      router.push('/login');
    }
  }, [user, loading, router, locale]);

  // Show nothing while checking auth on the client
  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white shadow-lg rounded-lg max-w-md w-full">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-orange-300 h-24 w-24"></div>
            <div className="h-4 bg-orange-300 rounded w-3/4 mt-6"></div>
            <div className="h-4 bg-orange-200 rounded w-1/2 mt-4"></div>
            <div className="h-10 bg-orange-300 rounded w-3/4 mt-6"></div>
          </div>
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">{t('auth.required')}</h2>
        <p className="text-gray-600 mb-6">
          {t('auth.loginNeeded')}
        </p>
        <Link
          href="/login"
          className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          {t('auth.goToLogin')}
        </Link>
      </div>
    </div>
  );
}
