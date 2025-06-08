// src/i18n/navigation.js
import { createNavigation } from 'next-intl/navigation';
import { routing, locales } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export { locales };
