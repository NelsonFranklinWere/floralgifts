const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      '@heroicons/react',
      '@headlessui/react',
      'date-fns',
    ],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
    deviceSizes: [390, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    dangerouslyAllowSVG: false,
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    // Every quality used in <Image quality={…} /> must appear here (restart dev after changes).
    qualities: [55, 60, 62, 68, 70, 72, 75, 80, 85, 90],
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'floralwhispersgifts.co.ke' }],
        destination: 'https://www.floralwhispersgifts.co.ke/:path*',
        permanent: true,
      },
      { source: '/admin/login', destination: '/staff/login', permanent: false },
      { source: '/admin/products/new', destination: '/staff/products/new', permanent: false },
      { source: '/admin/products/:id', destination: '/staff/products/:id', permanent: false },
      { source: '/admin/products', destination: '/staff/products', permanent: false },
      { source: '/admin/orders/:id', destination: '/staff/orders/:id', permanent: false },
      { source: '/admin/orders', destination: '/staff/orders', permanent: false },
      { source: '/admin', destination: '/staff', permanent: false },
    ];
  },

  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
