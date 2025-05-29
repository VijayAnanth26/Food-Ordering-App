// frontend/src/components/NavBarWrapper.js
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();

  if (pathname === '/login') return null; // Hide navbar on login page

  return <Navbar />;
}
