/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // ✅ Add for local images
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  output: "standalone",
  
  // ✅ KEEP THIS (fixes 308)
  trailingSlash: true,
  
  // ✅ API PERFORMANCE
  experimental: {
    serverComponentsExternalPackages: ['prisma'],
  },
  
  // ✅ FAST API CACHE
  headers: async () => [
    {
      // Cache products 5 mins
      source: '/api/products/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, s-maxage=300, stale-while-revalidate=59',
        },
      ],
    },
  ],
};

module.exports = nextConfig;