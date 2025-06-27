/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // Configure for Azure App Service
  output: 'standalone',
  
  // Configure image domains if needed
  images: {
    unoptimized: false, // Can use optimized images with App Service
  },

  // Standard configuration
  poweredByHeader: false,
  trailingSlash: false,
  
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