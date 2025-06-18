/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // For Azure Static Web Apps with API routes - hybrid mode
  trailingSlash: true,
  
  // Configure image domains if needed
  images: {
    unoptimized: true, // Optimize for static hosting
    remotePatterns: [
      // Add any external image domains here if needed
    ],
  },

  // Disable static export due to API routes and AI functionality
  // output: 'export',
  
  // Optimize for Azure Static Web Apps
  poweredByHeader: false,
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig; 