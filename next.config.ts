import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Fix memory & Turbopack issues
  experimental: {
    turbopack: false, // Disable Turbopack (Windows crash fix)
    swcPlugins: [],   // Force stable SWC compiler
  },
  
  // ✅ Image optimization (keep your existing)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // ✅ Production optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ✅ Webpack config for memory & server-side
  webpack: (config, { isServer }) => {
    // Fix server-side modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    // Minimal stats for faster builds
    config.stats = "minimal";
    return config;
  },

  // ✅ Output settings
  output: "standalone", // Docker/Vercel optimized
  trailingSlash: true,
};

export default nextConfig;