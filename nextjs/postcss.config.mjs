const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
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
  },
};

export default config;
