const withOffline = require('next-offline');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
const webpack = require("webpack");
// Initialize doteenv library
require("dotenv").config({ path: './.env' });


let nextConfig = {
	// next-offline options:
  generateBuildId: async () => {
    // You can, for example, get the latest git commit hash here
    return 'dlingo-id-build'
  },
	async redirects() {
    return [
      {
        source: '/trending',
        destination: '/news', // Matched parameters can be used in the destination
        permanent: true,
      },
      {
        source: '/trending/search',
        destination: '/news/search', // Matched parameters can be used in the destination
        permanent: true,
      },
      {
        source: '/trending/detail/:id/:title',
        destination: '/news/detail/:id/:title', // Matched parameters can be used in the destination
        permanent: true,
      },
      {
        source: '/trending/detail/:category/:id/:title',
        destination: '/news/detail/:category/:id/:title', // Matched parameters can be used in the destination
        permanent: true,
      },
      {
        source: '/trending/:subcategory_id/:subcategory_title',
        destination: '/news/:subcategory_id/:subcategory_title', // Matched parameters can be used in the destination
        permanent: true,
      },
      {
        source: '/interest-topic',
        destination: '/news/interest-topic', // Matched parameters can be used in the destination
        permanent: true,
      },
      {
        source: '/news/search_v2',
        destination: '/news/search', // Matched parameters can be used in the destination
        permanent: true,
      },
    ]
  },
	images: {
    domains: ['placeimg.com', 'fornews.co'],
  },
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
			test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
			use: {
				loader: 'url-loader',
				options: {
					limit: 100000,
					name: '[name].[ext]',
				},
			},
		})

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
