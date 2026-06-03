import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'http',
        hostname: 'aussievapes.com.au',
      },
      {
        protocol: 'https',
        hostname: 'aussievapes.com.au',
      },
    ],
  },
};

export default nextConfig;
