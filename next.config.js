const withOffline = require('next-offline');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
const webpack = require("webpack");
// Initialize doteenv library
require("dotenv").config();


let nextConfig = {
	// next-offline options:
	dontAutoRegisterSw: true, // since we want runtime registration
	onDemandEntries: {
		maxInactiveAge: 25 * 1000 * 1000
	},
	webpack: config => {
		// Fixes npm packages that depend on `fs` module
		config.node = {
		  fs: 'empty'
		}
		/**
		 * Returns environment variables as an object
		 */
		const env = Object.keys(process.env).reduce((acc, curr) => {
				 acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
				 return acc;
	   }, {});

		config.module.rules.push({
			test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 100000
                }
            }
		});
	
		/** Allows you to create global constants which can be configured
		* at compile time, which in our case is our environment variables
		*/
		config.plugins.push(new webpack.DefinePlugin(env));
		return config
	}
};

// nextConfig = withOffline(nextConfig);
nextConfig = withCSS(nextConfig);
nextConfig = withSass(nextConfig);

// generate sitemap.xml
// const sitemap = require('nextjs-sitemap-generator');  
// sitemap({  
// 	baseUrl: 'http://localhost:3000',  
// 	pagesDirectory: __dirname + "/pages",  
// 	targetDirectory : 'out/static/'  
// });

module.exports = nextConfig;
