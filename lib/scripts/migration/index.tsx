import * as dotenv from 'dotenv'; dotenv.config({ path: "./.env" });
import { buildClient } from '@datocms/cma-client-node';
import { NodeHtmlMarkdown } from 'node-html-markdown'
import * as parse5 from 'parse5';
import { parse5ToStructuredText } from 'datocms-html-to-structured-text';
import { GraphQLClient, gql } from "graphql-request";
import slugify from 'slugify'
import WPAPI from 'wpapi';
import { decode as decodeHTMLEntities } from 'html-entities';

export { decodeHTMLEntities }
export const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN, environment: 'dev' })
export const toMarkdown = new NodeHtmlMarkdown()
export const baseDomain = 'konstframjandet.se/wp-json'

export const buildWpApi = (subdomain: string | undefined) => {

	console.log(`http://${subdomain ? subdomain + '.' : ''}${baseDomain}`)
	const wpapi = new WPAPI({
		endpoint: `http://${subdomain ? subdomain + '.' : ''}${baseDomain}`,
		username: process.env.WP_USERNAME,
		password: process.env.WP_PASSWORD,
		auth: true
	});

	wpapi.news = wpapi.registerRoute('wp/v2', '/kf-news/(?P<id>)');
	wpapi.project = wpapi.registerRoute('wp/v2', '/kf-project/(?P<id>)');
	wpapi.about = wpapi.registerRoute('wp/v2', '/kf-about/(?P<id>)');
	return wpapi
}

export const itemTypeToId = async (model: string) => (await client.itemTypes.list()).find(({ api_key }) => api_key === model)

export const allPages = async (wpapi, type: string, opt = { perPage: 100 }) => {

	const items = []
	let page = 0;
	console.log('Getting all pages: ' + type)

	while (true) {
		try {

			const res = await wpapi[type]().page(++page).perPage(opt.perPage).param({ status: 'publish' })
			if (res.length === 0 || Object.keys(res).length === 0) break
			items.push.apply(items, res)

		} catch (err) {
			console.error(err)
			break;
		}
	}
	return items
}

export const cleanObject = (obj: any) => {
	Object.keys(obj).forEach((k) => !obj[k] && delete obj[k]);
	return obj
}

export const parseLink = (url: string) => {

	if (!url) return undefined
	url = url.toLowerCase()
	if (url.startsWith('http') || url.startsWith('https')) return url

	return `https://${url}`

}

export const parseSlug = (slug: string) => {
	return slugify(decodeURI(slug), {
		lower: true
	})
}

export const htmlToMarkdown = (content: string) => {
	if (!content) return content

	content = toMarkdown.translate(content)
	content = content.replaceAll('  ', ' ')
	content = content.replaceAll(' \n', '\n')
	content = decodeHTMLEntities(content)
	return content.trim()
}

export const htmlToStructuredContent = async (html: string) => {
	html = html.replaceAll('\n', '')
	html = decodeHTMLEntities(html)
	return await parse5ToStructuredText(parse5.parse(html, { sourceCodeLocationInfo: true }))
}

export const uploadMedia = async (image, tags: string[] = []) => {
	if (!image?.url)
		throw 'no image'

	const upload = await client.uploads.createFromUrl({
		url: image.url,
		skipCreationIfAlreadyExists: true,
		//onProgress: (p) => console.log(p),
		default_field_metadata: {
			en: {
				title: image.title || null,
				alt: null,
				custom_data: {}
			}
		},
	});

	return upload
}


export async function allDistricts() {
	const graphQLClient = new GraphQLClient("https://graphql.datocms.com", {
		headers: {
			Authorization: process.env.GRAPHQL_API_TOKEN,
			"X-Exclude-Invalid": 'true',
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

export const chunkArray = (array: any[], chunkSize: number) => {
	const newArr = []
	for (let i = 0; i < array.length; i += chunkSize)
		newArr.push(array.slice(i, i + chunkSize));
	return newArr
}

export const insertRecord = async (el: any, itemTypeId: string) => {

	if (el.image) {
		try {
			const upload = await uploadMedia(el.image)
			el.image = { upload_id: upload.id }
		} catch (err) {
			console.log('IMAGE ERROR: ', err)
			delete el.image;
		}
	}
	try {
		const item = await client.items.create({
			item_type: { type: 'item_type', id: itemTypeId },
			...el
		})
		return item
	} catch (err) {
		throw err
	}
}