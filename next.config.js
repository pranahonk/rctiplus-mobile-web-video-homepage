const withOffline = require('next-offline');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');

let nextConfig = {
	// next-offline options:
	dontAutoRegisterSw: true, // since we want runtime registration
	onDemandEntries: {
		maxInactiveAge: 25 * 1000 * 1000
	}
};

nextConfig = withOffline(nextConfig);
nextConfig = withCSS(nextConfig);
nextConfig = withSass(nextConfig);

module.exports = nextConfig;
