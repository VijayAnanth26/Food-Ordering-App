// frontend/src/components/NavBarWrapper.js
'use client';

import { usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const locale = useLocale();

  if (pathname === `/${locale}/login`) return null; // Hide navbar on login page

  return <Navbar />;
}
