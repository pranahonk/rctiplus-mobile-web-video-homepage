const withOffline = require('next-offline');
const withSass = require('@zeit/next-sass');

const nextConfig = {
  // next-offline options:
  dontAutoRegisterSw: true, // since we want runtime registration
};

module.exports = withSass(withOffline(nextConfig));
