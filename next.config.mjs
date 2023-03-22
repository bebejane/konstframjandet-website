import { GraphQLClient, gql } from "graphql-request";

const primarySubdomain = "forbundet";
const baseDomain = "konstframjandet.se";

async function allDistricts() {
	const graphQLClient = new GraphQLClient("https://graphql.datocms.com", {
		headers: {
			Authorization: process.env.GRAPHQL_API_TOKEN,
			"X-Exclude-Invalid": true,
		},
	});

	const { districts } = await graphQLClient.request(gql`
		{
			districts: allDistricts(first: 100) {
				id
				name
				subdomain
			}
		}
	`);
	return districts;
}

export default async (phase, { defaultConfig }) => {
	const sites = {};
	const districts = await allDistricts();

	districts
		.filter(({ subdomain }) => subdomain)
		.map(({ subdomain }) => (sites[subdomain] = { domain: `${subdomain}.${baseDomain}` }));

	const siteKeys = Object.keys(sites);

	/**
	 * @type {import('next').NextConfig}
	 */
	const nextConfig = {
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
		sassOptions: {
			includePaths: ["./components", "./pages"],
			prependData: `
				@use 'sass:math';
				@import './lib/styles/mediaqueries'; 
				@import './lib/styles/fonts';
			`,
		},
		i18n: {
			locales: siteKeys,
			defaultLocale: primarySubdomain,
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
			return config;
		},
	};
	return nextConfig;
};
