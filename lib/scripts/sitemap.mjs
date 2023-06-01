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
	districts.forEach(async ({ subdomain }) => {
		const pages = await globby([
			`.next/server/pages/${subdomain}/**/*.html`,
			`!.next/server/pages/${subdomain}/404.html`,
			`!.next/server/pages/${subdomain}/500.html`,
		]);

		const siteUrl = subdomain === "it" ? "https://example.it" : "https://example.com";

		const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>${siteUrl}</loc>            
            <lastmod>${new Date().toISOString()}</lastmod>
        </url>
        ${pages
					.map((page) => {
						const route = page.replace(`.next/server/pages/${subdomain}`, "").replace(".html", "");

						return `<url>
                  <loc>${siteUrl}${route}</loc>
                  <lastmod>${new Date().toISOString()}</lastmod>                  
              </url>
            `;
					})
					.join("")}
    </urlset>
    `;

		const formatted = prettier.format(sitemap, {
			parser: "html",
		});

		writeFileSync(`public/sitemap-${subdomain}.xml`, formatted);
	});
}

generate();
