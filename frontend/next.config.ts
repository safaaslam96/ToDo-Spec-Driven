import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static optimization
  output: 'standalone',

  // Image optimization
  images: {
    domains: ['vercel.app', 'huggingface.co'],
  },

  // Rewrites for API proxy (only in development)
  async rewrites() {
    // In production, use NEXT_PUBLIC_API_URL from environment variables
    // In development, proxy to localhost:8000
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:8000/api/:path*",
        },
      ];
    }
    return [];
  },

  // Headers for security and CORS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
