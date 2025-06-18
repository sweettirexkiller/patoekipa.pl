/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // For Azure Static Web Apps with API routes, we need standard mode (not static export)
  trailingSlash: true,
  
  // Configure image domains if needed
  images: {
    remotePatterns: [
      // Add any external image domains here if needed
    ],
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig; 