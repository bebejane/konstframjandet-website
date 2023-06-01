import * as dotenv from "dotenv";
import { GraphQLClient, gql } from "graphql-request";
import { writeFileSync } from "fs";
import { globby } from "globby";
import prettier from "prettier";

dotenv.config({ path: "./.env" });

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

async function generate() {
	const districts = await allDistricts();

	const robots = `
			# *
			User-agent: *
			Allow: /

			# Block all crawlers for districts
			${districts.map((district) => `Disallow: /${district.subdomain}`).join("\n")}

			# Host
			Host: https://www.konstframjandet.se

			# Sitemaps
			Sitemap: https://www.konstframjandet.se/sitemap.xml
		`;

	writeFileSync(`public/robots.txt`, robots.replaceAll(/\t/g, ""));
}

generate();
