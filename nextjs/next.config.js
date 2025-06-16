/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // Enable static export for Azure Static Web Apps
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  // Configure image domains if needed
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      // Add any external image domains here if needed
    ],
  },
};

module.exports = nextConfig; 