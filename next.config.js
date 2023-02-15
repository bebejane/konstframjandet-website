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
	async rewrites() {
		return [
			{
				has: [
					{
						type: "host",
						value: "(?distrikt1.*)",
					},
				],
				source: "/",
				destination: "/",
			},
			{
				has: [
					{
						type: "host",
						value: "(?distrikt2.*)",
					},
				],
				source: "/",
				destination: "/",
			},
		];
	},
};

/**
 * @type {import('next').NextConfig}
 */
const config = { sassOptions, ...nextOptions };
module.exports = config;
