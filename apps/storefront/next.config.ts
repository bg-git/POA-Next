// next.config.js (ESM)
import type { NextConfig } from 'next';
import createBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  compiler: {
    // safe: remove console.* in production except warn/error
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com', pathname: '**' },
    ],
    formats: ['image/avif', 'image/webp'] as any,
    deviceSizes: [360, 414, 480, 540, 640, 680, 750, 828, 1024, 1280, 1400, 1600],
    imageSizes: [48, 60, 64, 75, 96, 128, 256, 300, 350, 400, 500, 600, 750, 900],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default withBundleAnalyzer(nextConfig);

