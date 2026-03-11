const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200], // Reduced max size for faster loading
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Reduced sizes
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
    dangerouslyAllowSVG: false,
    unoptimized: false,
    loader: 'default',
    formats: ['image/webp', 'image/avif'], // Prefer modern formats for better compression
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'floralwhispersgifts.co.ke',
          },
        ],
        destination: 'https://www.floralwhispersgifts.co.ke/:path*',
        permanent: true,
      },
    ];
  },
  // Webpack configuration for path aliases
  webpack: (config) => {
    // Ensure @/ alias resolves correctly
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },
}

module.exports = nextConfig

