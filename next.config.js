/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      // 🔥 ADD for Vercel/CDN images
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  output: "standalone",
  
  // ✅ KEEP THIS (SEO friendly)
  trailingSlash: true,
  
  // ✅ Prisma support
  experimental: {
    serverComponentsExternalPackages: ['prisma'],
  },
  
  // 🔥 FIXED HEADERS - Separate cache strategies
  async headers() {
    return [
      // ✅ API: Short cache for shop (fresh data)
      {
        source: '/api/products',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300', // 1min + 5min stale
          },
        ],
      },
      
      // ✅ Admin API: No cache (fresh admin data)
      {
        source: '/api/products/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
      
      // ✅ Static assets: Long cache
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      
      // ✅ Upload API: No cache
      {
        source: '/api/upload',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;