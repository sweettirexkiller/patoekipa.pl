/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // Configure image domains if needed
  images: {
    unoptimized: true, // Required for Azure SWA
  },

  // Optimize for Azure Static Web Apps
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