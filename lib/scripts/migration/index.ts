
import * as dotenv from 'dotenv'; dotenv.config({ path: "./.env" });
import fs from 'fs'
import path from 'path';
import { buildClient, buildBlockRecord, Client, ApiError } from '@datocms/cma-client-node';
import { NodeHtmlMarkdown } from 'node-html-markdown'
import * as parse5 from 'parse5';
import { GraphQLClient, gql } from "graphql-request";
import slugify from 'slugify'
import WPAPI from 'wpapi';
import { decode as decodeHTMLEntities } from 'html-entities';
import sanitizeHtml from 'sanitize-html';
import { HastNode, HastElementNode, CreateNodeFunction, Context, parse5ToStructuredText, visitChildren } from 'datocms-html-to-structured-text';
import { visit, find } from 'unist-utils-core';
import getVideoId from 'get-video-id';

export { default as striptags } from 'striptags'
export { decodeHTMLEntities, ApiError }
export const DATOCMS_ENVIRONMENT = 'main'
export const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN, environment: DATOCMS_ENVIRONMENT, extraHeaders: { 'X-Include-Drafts': 'true' } })
export const toMarkdown = new NodeHtmlMarkdown()
export const baseDomain = 'konstframjandet.se/wp-json'
export const noImage = undefined //{ url: 'https://www.datocms-assets.com/94618/1680937798-no-photo-available.png', title: undefined }

export const buildWpApi = (subdomain: string | undefined) => {

	subdomain = subdomain === 'forbundet' ? undefined : subdomain

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
	wpapi.contact = wpapi.registerRoute('wp/v2', '/kf-contact/(?P<id>)');
	wpapi.subdomain = subdomain
	return wpapi
}

export const itemTypeToId = async (model: string) => (await client.itemTypes.list()).find(({ api_key }) => api_key === model)
export const allItemTypes = async () => (await client.itemTypes.list())
export const allBlockIds = async () => {
	const items = await allItemTypes();
	return {
		image: items.find(({ api_key }) => api_key === 'image').id,
		video: items.find(({ api_key }) => api_key === 'video').id,
		audio: items.find(({ api_key }) => api_key === 'audio').id,
	}
}

export const writeErrors = (errors: any[], subdomain: string, type: string) => {
	if (errors.length) {
		fs.writeFileSync(`./lib/scripts/migration/errors/${subdomain}-${type}.error.json`, JSON.stringify(errors, null, 2), { encoding: 'utf8' })
		console.log(`Errors (${subdomain}-${type}): ${errors.length}`)
	}
}

export const allPages = async (wpapi, type: string, opt = { perPage: 100 }) => {

	if (fs.existsSync(`./lib/scripts/migration/data/${wpapi.subdomain}-${type}.json`))
		return JSON.parse(fs.readFileSync(`./lib/scripts/migration/data/${wpapi.subdomain}-${type}.json`, { encoding: 'utf8' }))

	const items = []
	let page = 0;
	console.log('Getting all pages: ' + type)

	while (true) {
		try {
			const res = await wpapi[type]().page(++page).perPage(opt.perPage).param({ status: 'publish' })
			if (res.length === 0 || Object.keys(res).length === 0) break
			items.push.apply(items, res)
		} catch (err) {
			if (err.code !== 'rest_post_invalid_page_number')
				console.error(err)
			break;
		}
	}
	return items
}

export const cleanObject = (obj: any) => {
	Object.keys(obj).forEach((k) => {
		!obj[k] && delete obj[k]
		typeof obj[k] === 'string' && (obj[k] = decodeHTMLEntities(obj[k]).trim())
	});

	return obj
}

export const parseLink = (url: string) => {
	if (!url) return undefined
	if (url.toLowerCase().startsWith('http://') || url.toLowerCase().startsWith('https://')) return url
	return `https://${url}`
}


export const printProgress = (progress: string) => {
	return console.log(progress)
	process.stdout.clearLine(0);
	process.stdout.cursorTo(0);
	process.stdout.write(progress);
}

export const parseSlug = (slug: string) => {
	return slugify(decodeURI(slug), { lower: true })
}

export const htmlToMarkdown = (content: string) => {
	if (!content) return content

	content = toMarkdown.translate(content)
	content = content.replaceAll('  ', ' ')
	content = content.replaceAll(' \n', '\n')
	content = decodeHTMLEntities(content)
	return content.trim()
}

export const uploadMedia = async (image, tags: string[] = []) => {
	if (!image?.url)
		throw 'no image'

	const upload = await client.uploads.createFromUrl({
		url: image.url,
		skipCreationIfAlreadyExists: true,
		tags,
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


export default async function findOrCreateUploadWithUrl(
	client: Client,
	url: string,
	title?: string
) {
	let upload;

	if (url.startsWith('https://www.datocms-assets.com')) {
		const pattern = path.basename(url).replace(/^[0-9]+\-/, '');

		const matchingUploads = await client.uploads.list({
			filter: {
				fields: {
					filename: {
						matches: {
							pattern,
							case_sensitive: false,
							regexp: false,
						},
					},
				},
			},
		});

		upload = matchingUploads.find((u) => {
			return u.url === url;
		});
	}

	if (!upload) {
		upload = await client.uploads.createFromUrl({ url });
	}

	return upload;
}


export async function allDistricts() {
	const graphQLClient = new GraphQLClient("https://graphql.datocms.com", {
		headers: {
			Authorization: process.env.GRAPHQL_API_TOKEN,
			"X-Environment": DATOCMS_ENVIRONMENT,
			"X-Exclude-Invalid": 'true',
		},
	});

	const { districts } = await graphQLClient.request(gql`
		{
			districts: allDistricts(first: 100) {
				id
				name
				subdomain
				email
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

export const insertRecord = async (el: any, itemTypeId: string, tags: string[] = []) => {

	if (el.image) {
		try {
			const upload = await uploadMedia(el.image, tags)
			el.image = { upload_id: upload.id }
		} catch (err) {
			if (err !== 'no image')
				console.error(err)
			delete el.image;
		}
	}
	try {

		let item = await client.items.create({ item_type: { type: 'item_type', id: itemTypeId }, ...el, createdAt: undefined })

		if (el.createdAt)
			item = await client.items.update(item.id, { meta: { created_at: el.createdAt, first_published_at: el.createdAt } })

		return item
	} catch (err) {
		throw err
	}
}

export const removeTrailingBr = (html: string): string => {
	return html.replace(/^\s*(?:<br\s*\/?\s*>)+|(?:<br\s*\/?\s*>)+\s*$/gi, '');
}

export type BlockIds = {
	video?: string
	audio?: string
	image?: string
}

export const cleanWordpressHtml = (html: string) => {


	html = html.replaceAll('<P>', '<p>')
	html = html.replaceAll('</P>', '</p>')
	html = html.replaceAll('<div><div>\n<div><div>\n', '<br />')
	html = html.replaceAll('<br>', '<br />')
	html = html.replaceAll('<p><br />', '<p>')
	html = html.replaceAll('<br /></p>', '</p>')
	html = html.replaceAll('<div></div>', '')
	html = html.replaceAll('<p></p>', '<br />')
	html = html.replaceAll('<p> </p>', '<br />')
	html = html.replaceAll('<p>&nbsp;</p>', '<br />')
	html = html.replaceAll('<p class=\"blank\">&nbsp;</p>', '<br />')
	html = html.replaceAll('<br /><br /><br />', '<br /><br />')
	html = html.replaceAll('\n', '')

	/*
	html = sanitizeHtml(html, {
		allowedTags: [
			"h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "dd", "div", "img",
			"dl", "dt", "li", "ol", "p", "pre", "ul", "a", "b", "br", "em", "i",
			"span", "strong", "sub", "sup", "iframe"
		],
	})
	*/
	html = removeTrailingBr(html)
	html = decodeHTMLEntities(html)

	return html
}

export const htmlToStructuredContent = async (html: string, blocks: BlockIds = {}, tags: string[] = []) => {
	if (!html) return html
	html = cleanWordpressHtml(html)

	const content = await parse5ToStructuredText(parse5.parse(html, { sourceCodeLocationInfo: true }), {
		preprocess: (tree: HastNode) => {
			if (!blocks.image) return

			const liftedImages = new WeakSet();
			const liftedIframes = new WeakSet();
			const body = find(
				tree,
				(node: HastNode) =>
					(node.type === 'element' && node.tagName === 'body') ||
					node.type === 'root',
			)
			// process images
			visit<HastNode, HastElementNode & { children: HastNode[] }>(
				body,
				(node, index, parents) => {
					if (
						node.type !== 'element' ||
						node.tagName !== 'img' ||
						liftedImages.has(node) ||
						parents.length === 1
					) {
						return;
					}
					const imgParent = parents[parents.length - 1];
					imgParent.children.splice(index, 1);
					let i = parents.length;
					let splitChildrenIndex = index;
					let childrenAfterSplitPoint: HastNode[] = [];
					while (--i > 0) {
						const parent = parents[i];
						const parentsParent = parents[i - 1];
						childrenAfterSplitPoint =
							parent.children.splice(splitChildrenIndex);
						splitChildrenIndex = parentsParent.children.indexOf(parent);
						let nodeInserted = false;
						if (i === 1) {
							splitChildrenIndex += 1;
							parentsParent.children.splice(splitChildrenIndex, 0, node);
							liftedImages.add(node);
							nodeInserted = true;
						}
						splitChildrenIndex += 1;
						if (childrenAfterSplitPoint.length > 0) {
							parentsParent.children.splice(splitChildrenIndex, 0, {
								...parent,
								children: childrenAfterSplitPoint,
							});
						}
						if (parent.children.length === 0) {
							splitChildrenIndex -= 1;
							parentsParent.children.splice(
								nodeInserted ? splitChildrenIndex - 1 : splitChildrenIndex,
								1,
							);
						}
					}
				},
			);
		},
		handlers: {
			img: async (
				createNode: CreateNodeFunction,
				node: HastNode,
				context: Context,
			) => {

				if (node.type !== 'element' || !node.properties || !blocks.image)
					return;

				let { src: url, srcSet } = node.properties;
				if (srcSet)
					url = srcSet.sort((a, b) => parseInt(a.split(' ')[1]) > parseInt(b.split(' ')[1]) ? -1 : 1)[0].split(' ')[0]

				if (!url)
					return null

				const upload = await uploadMedia({ url }, tags);

				return createNode('block', {
					item: buildBlockRecord({
						item_type: { id: blocks.image, type: 'item_type' },
						image: {
							upload_id: upload.id,
						},
						layout: 'medium',
					}),
				});
			},
			//@ts-ignore
			a: async (
				createNode: CreateNodeFunction,
				node: HastNode,
				context: Context,
			) => {

				if (node.type !== 'element' || !node.properties)
					return context.defaultHandlers.a(createNode, node, context)

				const fileTypes = ['pdf', 'doc', 'xlsx', 'mp3', 'wav', 'doc', 'docx', 'zip', 'jpg', 'jpeg', 'png', 'gif', 'svg']
				const fileEnding = node.type === 'element' ? node.properties?.href?.toLowerCase().split('.').at(-1) : null
				const { href: url } = node.properties;

				if (!url.toLowerCase().includes('konstframjandet.se/wp-content/uploads') || !fileTypes.includes(fileEnding))
					return context.defaultHandlers.a(createNode, node, context)

				console.log('upload file:', url, 'as', fileEnding)

				const upload = await uploadMedia({ url }, tags);
				node.properties.href = upload.url

				return context.defaultHandlers.a(createNode, node, context)
			},
			iframe: async (
				createNode: CreateNodeFunction,
				node: HastNode,
				_context: Context,
			) => {

				if (node.type !== 'element' || !node.properties || !node.properties.src)
					return;

				const { src: url, width, height } = node.properties;

				// Handle soundcloud embeds
				if (url.includes('soundcloud')) {
					if (!blocks.audio) return
					const soundcloudUrl = decodeURIComponent(url).split('url=')[1]
					//console.log('audio block', soundcloudUrl)
					return createNode('block', {
						item: buildBlockRecord({
							item_type: { id: blocks.audio, type: 'item_type' },
							url: soundcloudUrl
						}),
					});
				}

				if (!blocks.video) return
				const meta = getVideoId(url)

				if (!['vimeo', 'youtube'].includes(meta.service)) {
					console.log('not valid video', meta.service)
					return
				}

				const videoUrl = meta.service === 'vimeo' ? `https://vimeo.com/${meta.id}` : `https://www.youtube.com/watch?v=${meta.id}`
				const video = {
					provider: meta.service,
					provider_uid: meta.id,
					url: videoUrl,
					width: width || 1280,
					height: height || 720,
					thumbnail_url: meta.service === 'vimeo' ? `https://i.vimeocdn.com/video/${meta.id}_1280x720.jpg` : `https://img.youtube.com/vi/${meta.id}/maxresdefault.jpg`,
					title: `${meta.service} ${meta.id}`
				}

				//console.log('video block', videoUrl)

				return createNode('block', {
					item: buildBlockRecord({
						item_type: { id: blocks.video, type: 'item_type' },
						video
					}),
				});
			},
		},
	})

	return content
}

export const parseDatoError = (err: any): string => {
	const errors = (err as ApiError).errors.map(({ attributes: { code, details } }) => ({ code, field: details?.field, message: details?.message, detailsCode: details?.code, errors: Array.isArray(details?.errors) ? details?.errors.join('. ') : undefined }))
	return errors.map(({ code, field, message, detailsCode, errors }) => `${code} ${field ? `(${field})` : ''} ${message || ''} ${detailsCode || ''} ${errors ? `(${errors})` : ''}`).join('\n')
}

