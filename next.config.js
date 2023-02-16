const webpack = require("webpack");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

const sassOptions = {
	includePaths: ["./components", "./pages"],
	prependData: `
    @use "sass:math";
    @import "./lib/styles/mediaqueries"; 
    @import "./lib/styles/fonts";
  `,
};

const sites = {
	distrikt1: {
		domain: "distrikt1.konstframjandet.se",
	},
	distrikt2: {
		domain: "distrikt2.konstframjandet.se",
	},
};
const siteKeys = Object.keys(sites);

const nextOptions = {
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	devIndicators: {
		buildActivity: false,
	},
	experimental: {
		scrollRestoration: true,
	},
	publicRuntimeConfig: {
		sites,
	},
	i18n: {
		locales: siteKeys,
		defaultLocale: siteKeys[0],
		domains: siteKeys.map((siteKey) => ({
			domain: sites[siteKey].domain,
			defaultLocale: siteKey,
		})),
	},
	webpack: (config, ctx) => {
		config.module.rules.push({
			test: /\.(graphql|gql)$/,
			exclude: /node_modules/,
			loader: "graphql-tag/loader",
		});
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			exclude: /node_modules/,
			use: ["@svgr/webpack"],
		});
		config.plugins.push(
			new webpack.DefinePlugin({
				__DEV__: process.env.NODE_ENV === "development",
			})
		);
		return config;
	},
};

/**
 * @type {import('next').NextConfig}
 */
const config = { sassOptions, ...nextOptions };
module.exports = config;
