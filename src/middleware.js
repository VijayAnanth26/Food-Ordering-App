// src/middleware.js
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/routing';

// This middleware handles locale detection and redirection
export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale: 'en',
  
  // This uses the locale prefix only when needed
  localePrefix: 'as-needed',
  
  // Properly detect the locale from various sources
  localeDetection: 'cookie-header-query'
});

export const config = {
  // Match all pathnames except for
  // - files with extensions (e.g. static files)
  // - API routes
  // - _next paths (internal Next.js paths)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
