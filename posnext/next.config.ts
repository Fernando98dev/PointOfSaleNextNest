import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.DOMAIN || 'localhost'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
    ],
  }
};

export default nextConfig;
