/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**" },
    ],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  output: "standalone",
  trailingSlash: true,
  
  // 🔥 FIXED Next.js 16
  experimental: {
    serverExternalPackages: ['prisma'], // ✅ Correct key
  },
  
  async headers() {
    return [
      { source: '/api/products', headers: [{ key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' }] },
      { source: '/api/products/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/api/upload', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
    ];
  },
};

module.exports = nextConfig;