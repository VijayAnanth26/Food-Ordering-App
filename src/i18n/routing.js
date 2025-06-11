// src/i18n/routing.js
import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'es'];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  // This makes sure URLs don't have duplicate locale prefixes
  urlMappingStrategy: 'pathname',
  // Only add locale prefix when needed to differentiate from default locale
  localePrefix: 'as-needed'
});
