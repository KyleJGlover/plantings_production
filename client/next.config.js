module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["assets.plantings.dev"],
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
