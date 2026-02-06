/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
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
  // Enable static page generation for better performance
  // Note: optimizeCss disabled to avoid critters dependency issue
  // Vercel handles CSS optimization automatically
}

module.exports = nextConfig

