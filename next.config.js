const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
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
    loader: 'default',
    formats: ['image/webp', 'image/avif'], // Prefer modern formats for better compression
    qualities: [70, 75, 80],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/sell',
        destination: '/sale',
        permanent: true,
      },
      {
        source: '/sell.csv',
        destination: '/feeds/meta.csv',
        permanent: true,
      },
      {
        source: '/sale.csv',
        destination: '/feeds/meta.csv',
        permanent: true,
      },
      {
        source: '/admin/sell-catalog',
        destination: '/admin/sale-catalog',
        permanent: true,
      },
      {
        source: '/blog/pp2-graduation-kids-gifts-2026-nairobi',
        destination: '/blog/pp2-graduation-gifts-2026-boys-girls',
        permanent: true,
      },
      {
        source: '/blog/national-girlfriends-day-2026-nairobi',
        destination: '/blog/beyond-cash-bouquets-girlfriends-day-2026',
        permanent: true,
      },
      { source: '/blog/money-bouquet-nairobi', destination: '/money-bouquet-nairobi', permanent: true },
      { source: '/blog/luxury-money-bouquet-nairobi', destination: '/money-bouquet-nairobi', permanent: true },
      { source: '/blog/period-care-package', destination: '/period-care-package-kenya', permanent: true },
      { source: '/blog/period-care-package-self-care-box', destination: '/period-care-package-kenya', permanent: true },
      { source: '/blog/surprise-gifts-for-wife-nairobi', destination: '/blog/best-gifts-for-wives-nairobi', permanent: true },
      { source: '/blog/nairobi-florist-shop', destination: '/blog/best-florist-nairobi', permanent: true },
      { source: '/blog/florist-nairobi', destination: '/blog/best-florist-nairobi', permanent: true },
      { source: '/blog/flower-shop-nairobi', destination: '/blog/best-florist-nairobi', permanent: true },
      { source: '/blog/same-day-flower-delivery-nairobi', destination: '/same-day-delivery-nairobi', permanent: true },
      { source: '/blog/same-day-flower-delivery-nairobi-cbd', destination: '/same-day-delivery-nairobi', permanent: true },
      { source: '/blog/teddy-bears-perfect-gifts-for-every-occasion', destination: '/giant-teddy-bears-nairobi', permanent: true },
      { source: '/blog/teddy-bear-delivery-nairobi', destination: '/giant-teddy-bears-nairobi', permanent: true },
      { source: '/blog/giant-teddy-bears-nairobi', destination: '/giant-teddy-bears-nairobi', permanent: true },
      { source: '/blog/funeral-flowers-nairobi', destination: '/funeral-wreaths-nairobi', permanent: true },
      { source: '/blog/fresh-fruit-basket', destination: '/blog/fruit-basket-nairobi', permanent: true },
      { source: '/blog/fresh-fruit-basket-nairobi', destination: '/blog/fruit-basket-nairobi', permanent: true },
      { source: '/blog/birthday-flowers-nairobi', destination: '/blog/birthday-flowers-nairobi-kenya', permanent: true },
      { source: '/blog/send-birthday-flowers-nairobi', destination: '/blog/birthday-flowers-nairobi-kenya', permanent: true },
      { source: '/blog/birthday-gifts-flowers-nairobi-kenya', destination: '/blog/birthday-flowers-nairobi-kenya', permanent: true },
      { source: '/blog/surprise-birthday-gifts-nairobi', destination: '/blog/best-birthday-gifts-nairobi-kenya', permanent: true },
      { source: '/blog/birthday-gift-shops-nairobi', destination: '/blog/best-birthday-gifts-nairobi-kenya', permanent: true },
      { source: '/blog/be-my-valentine-2026', destination: '/valentines-gifts-nairobi', permanent: true },
      { source: '/blog/luxury-valentine-romance-package', destination: '/valentines-gifts-nairobi', permanent: true },
      { source: '/blog/valentines-day-pre-orders-nairobi', destination: '/valentines-gifts-nairobi', permanent: true },
      { source: '/blog/valentines-day-gifts-2026', destination: '/valentines-gifts-nairobi', permanent: true },
      { source: '/blog/affordable-mothers-day-gifts-nairobi-kenya', destination: '/mothers-day-gifts-nairobi', permanent: true },
      { source: '/blog/mothers-day-gifts-kenya', destination: '/mothers-day-gifts-nairobi', permanent: true },
      { source: '/blog/easter-offers-nairobi', destination: '/blog/easter-gift-delivery-nairobi', permanent: true },
      { source: '/blog/easter-holiday-gifts-nairobi', destination: '/blog/easter-gift-delivery-nairobi', permanent: true },
      { source: '/blog/wine-shop-nairobi', destination: '/wine-gifts-nairobi', permanent: true },
      { source: '/blog/chocolates-shop-nairobi', destination: '/chocolate-gifts-nairobi', permanent: true },
      { source: '/blog/gift-hamper-delivery-nairobi', destination: '/gift-hampers-nairobi', permanent: true },
      { source: '/blog/send-flowers-nairobi', destination: '/send-gifts-to-kenya', permanent: true },
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

