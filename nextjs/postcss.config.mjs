const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Add cssnano for production optimization but keep it minimal
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          // Keep important CSS features for static export
          reduceIdents: false,
          zindex: false,
        }],
      },
    }),
  },
};

export default config;
