/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows all HTTPS images (consider restricting for production)
      },
    ],
    // Optional: Add if using Next.js Image Optimization
    domains: [
      'img.freepik.com', // Your image CDN domain
      'images.unsplash.com' // Example additional domain
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Bypass ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Bypass TypeScript errors during builds
  },
  // Security headers (recommended)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ],
      },
    ]
  },
  // Environment variable mapping (optional)
  env: {
    // Reference: process.env.NEXT_PUBLIC_EXAMPLE
  }
};

// For analyzing bundle size (optional dev dependency)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);