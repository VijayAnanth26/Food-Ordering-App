'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

export default function AuthGuard({ children }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const isLoginPage = pathname === `/${locale}/login`;

    if (!user && !isLoginPage) {
      router.push(`/${locale}/login?redirect=${pathname}`);
    } else {
      setCheckingAuth(false);
    }
  }, [user, pathname, router, locale]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-orange-50 text-orange-500 font-semibold text-lg">
        Checking authentication...
      </div>
    );
  }

  return children;
}
