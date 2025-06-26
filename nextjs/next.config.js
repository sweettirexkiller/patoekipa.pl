/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // For Azure Static Web Apps with API routes - hybrid mode
  trailingSlash: false,
  
  // Configure image domains if needed
  images: {
    unoptimized: true, // Required for Azure SWA
    remotePatterns: [
      // Add any external image domains here if needed
    ],
  },

  // Remove standalone output for Azure SWA compatibility
  // output: 'standalone', // This causes issues with Azure SWA
  
  // Optimize for Azure Static Web Apps
  poweredByHeader: false,
  
  // Azure SWA specific optimizations
  experimental: {
    // Ensure proper handling of API routes in Azure SWA
    serverComponentsExternalPackages: [],
  },
  
  // Add distDir to ensure proper Azure SWA deployment
  distDir: '.next',
  
  // Ensure proper asset prefix handling
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
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
  
  // Azure SWA specific headers and redirects
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 