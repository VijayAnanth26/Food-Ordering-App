// frontend/src/components/NavBarWrapper.js
'use client';

import { usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const locale = useLocale();

  // Hide navbar on login page
  // The pathname can be either /login or /{locale}/login depending on the localePrefix strategy
  if (pathname === '/login' || pathname === `/${locale}/login`) return null;

  return <Navbar />;
}
