/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // Enable static file serving from shared directory
  async rewrites() {
    return [
      {
        source: '/shared/:path*',
        destination: '/../shared/:path*',
      },
    ];
  },
  
  // Configure image domains if needed
  images: {
    remotePatterns: [
      // Add any external image domains here if needed
    ],
  },
};

module.exports = nextConfig; 