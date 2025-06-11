const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'tailwindcss.com',
      },
    ],
  },
  // Optimize the way CSS chunks are loaded to prevent preload warnings
  optimizeFonts: true,
  experimental: {
    // Disables the automatic font optimization to prevent preloading issues
    optimizeCss: false,
    // Avoid unnecessary preloads
    optimisticClientCache: true,
  },
  // Disable Next.js from optimizing/preloading CSS files
  optimizePackageImports: [],
};

module.exports = withNextIntl(nextConfig); 