import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization with modern remotePatterns (replaces deprecated domains)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '**.huggingface.co',
      },
      {
        protocol: 'https',
        hostname: '**.hf.space',
      },
    ],
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
