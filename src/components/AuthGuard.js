// frontend/src/components/AuthGuard.js
'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthGuard({ children }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!user && pathname !== '/login') {
      router.push('/login');
    } else {
      setCheckingAuth(false);
    }
  }, [user, pathname, router]);

  if (!user && pathname !== '/login') {
    return <div className="flex items-center justify-center h-screen">Redirecting...</div>;
  }

  if (checkingAuth) {
    return <div className="flex items-center justify-center h-screen">Checking auth...</div>;
  }

  return children;
}
