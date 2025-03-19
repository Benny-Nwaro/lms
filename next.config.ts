import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "exceptionhandling-production.up.railway.app"], // Add your production domain here
    remotePatterns: [
      {
        protocol: "https",
        hostname: "exceptionhandling-production.up.railway.app",
        pathname: "/uploads/**", // Allow images from the `/uploads/` directory
      },
    ],
  },
  /* Other config options */
};

export default nextConfig;
