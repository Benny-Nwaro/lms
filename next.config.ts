import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "https://flexi-lms-app-8a3b766e82f3.herokuapp.com"], // Add your production domain here
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://flexi-lms-app-8a3b766e82f3.herokuapp.com",
        pathname: "/uploads/**", // Allow images from the `/uploads/` directory
      },
    ],
  },
  /* Other config options */
};

export default nextConfig;
