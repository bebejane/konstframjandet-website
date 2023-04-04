import * as dotenv from 'dotenv'; dotenv.config({ path: "./.env" });
import { buildClient } from '@datocms/cma-client-node';
import fs from 'fs';
import stripTags from 'striptags';
import TurndownService from 'turndown';
import { decode as decodeEntities } from 'html-entities';
import WPAPI from 'wpapi';

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(() => resolve(undefined), ms));
const turndownService = new TurndownService();
const client = buildClient({ apiToken: process.env.GRAPHQL_API_TOKEN })

const endpoint = 'http://konstframjandet.se/wp-json'
const wpapi = new WPAPI({
	endpoint: endpoint,
	username: process.env.WP_USERNAME,
	password: process.env.WP_PASSWORD,
	auth: true,
});


wpapi.news = wpapi.registerRoute('wp/v2', '/kf-news/(?P<id>)');
wpapi.project = wpapi.registerRoute('wp/v2', '/kf-projects/(?P<id>)');
wpapi.about = wpapi.registerRoute('wp/v2', '/kf-about/(?P<id>)');

const migrateNews = async () => {

	try {
		const news = await wpapi.news().page(1).perPage(100).param({ status: 'publish' })
		console.log(news)
	} catch (err) {
		console.log(err)
	}

}

migrateNews()

/// UTILS ///////////////////////////////////////

const cleanContent = (content) => {
	content = content.replace(/<p>/gi, '').replace(/<br \/>/gi, '').replace(/\<\!--more--\>/gi, '\n').replace(/<\/p>/gi, '\n')
	content = content.replace(/\n\n\n/gi, '\n\n')
	for (let i = content.length - 1; i >= 0 && content[i] === '\n'; i--) content = content.slice(0, -1);
	return content.trim()
}

const uploadMedia = async (id: any, tags: string[] = []) => {

	if (!id) return undefined
	const media = isNaN(id) ? { source_url: id } : await wpapi.media().id(id)
	if (!media) return undefined

	const { caption, source_url: url } = media;
	const title = caption?.rendered ? stripTags(caption.rendered).replace(/\n/g, '').trim() : undefined
	console.log(`Uploading ${url.split('/').pop()} - "${title}"`)

	const upload = await client.uploads.createFromUrl({
		url,
		skipCreationIfAlreadyExists: true,
		onProgress: (p) => console.log(p),
		default_field_metadata: {
			en: {
				alt: title,
				title: title,
				custom_data: {
				}
			}
		},
	});

	return upload
}


