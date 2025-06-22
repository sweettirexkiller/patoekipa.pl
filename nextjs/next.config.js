/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // For Azure Static Web Apps - static export
  output: 'export',
  trailingSlash: true,
  
  // Configure image domains if needed
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      // Add any external image domains here if needed
    ],
  },

  // Remove standalone output for Azure SWA compatibility
  // output: 'standalone', // This causes issues with Azure SWA
  
  // Optimize for Azure Static Web Apps
  poweredByHeader: false,
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Webpack configuration for better module resolution
  webpack: (config, { isServer }) => {
    // Ensure proper module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    
    return config;
  },
};

module.exports = nextConfig; 