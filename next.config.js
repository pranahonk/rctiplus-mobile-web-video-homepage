const withOffline = require('next-offline');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');

let nextConfig = {
  // next-offline options:
  dontAutoRegisterSw: true, // since we want runtime registration
};

nextConfig = withOffline(nextConfig);
nextConfig = withSass(nextConfig);
nextConfig = withCSS(nextConfig);

module.exports = nextConfig;
