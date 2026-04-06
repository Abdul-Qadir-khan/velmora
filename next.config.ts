import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // ✅ Production (CORRECT placement)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ✅ Silences webpack warning (empty = default Turbopack)
  turbopack: {},

  // ✅ Output
  output: "standalone",
  trailingSlash: true,
};

export default nextConfig;