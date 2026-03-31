import { apiQuery } from 'next-dato-utils/api';
import {
	DatoCmsConfig,
	getItemApiKey,
	getUploadReferenceRoutes,
	getItemReferenceRoutes,
} from 'next-dato-utils/config';
import { MetadataRoute } from 'next';
import { DistrictBySubdomainDocument, ProjectBySubpageDocument, SitemapDocument } from '@/graphql';
import { getTenantUrl } from '@/lib/tenancy';
import { client } from '@/lib/client';
import { District } from '@/types/datocms-cma';

export function getRoute(item: any, _apiKey?: string): string {
	const apiKey = _apiKey ?? getItemApiKey(item);
	if (!apiKey) throw new Error('No api key found');
	const { slug } = item;
	switch (apiKey) {
		case 'start':
			return '/';
		case 'about':
			return `/om/${slug}`;
		case 'news':
			return `/aktuellt/${slug}`;
		case 'project':
			return `/projekt/${slug}`;
		case 'project_subpage':
			return `/projekt/${slug}/${item?.subpage?.slug}`;
		case 'district':
			return '/';
		case 'contact':
			return '/kontakt';
		default:
			throw new Error('No route found for apiKey: ' + apiKey);
	}
}

export default {
	route: async (item) => {
		const apiKey = getItemApiKey(item);
		if (apiKey === 'project_subpage') {
			const { project } = await apiQuery(ProjectBySubpageDocument, {
				variables: { subpageId: item.id },
			});
			return project ? `/projekt/${project.slug}/${item.slug}` : null;
		}
		return getRoute(item) ?? null;
	},
	routes: {
		start: async (item) => [getRoute(item, 'start')],
		about: async (item) => [getRoute(item, 'about')],
		news: async (item) => [
			getRoute(item, 'news'),
			'/aktuellt',
			...(await getItemReferenceRoutes(item.id)),
		],
		project: async (item) => [
			getRoute(item, 'project'),
			...(await getItemReferenceRoutes(item.id)),
		],
		project_subpage: async (item) => {
			const { project } = await apiQuery(ProjectBySubpageDocument, {
				variables: { subpageId: item.id },
			});
			return project
				? [`/projekt/${project.slug}/${item.slug}`, ...(await getItemReferenceRoutes(item.id))]
				: null;
		},
		district: async () => ['/', '/om', '/projekt', '/aktuellt'],
		contact: async () => ['/kontakt'],
		upload: async ({ id }) => getUploadReferenceRoutes(id),
	},
	sitemap: async ({ params }: RouteContext<'/[subdomain]/sitemap.xml'>) => {
		const { subdomain } = await params;
		const { district } = await apiQuery(DistrictBySubdomainDocument, { variables: { subdomain } });
		const { allNews, allAbouts, allProjects } = await apiQuery(SitemapDocument, {
			all: true,
			variables: { districtId: district?.id, first: 500, skip: 0 },
		});

		const staticRoutes = ['/', '/om', '/projekt', '/aktuellt', '/kontakt'];
		const posts = [
			...allAbouts,
			...allNews,
			...allProjects,
			...allProjects.flatMap((p) =>
				p.subpage.map((sub) => ({ ...sub, slug: `${p.slug}/${sub.slug}` })).flat(),
			),
		] as {
			_modelApiKey: string;
			_updatedAt: string;
			id: string;
			title: string;
			slug: string;
		}[];

		const sitemap = staticRoutes
			.map((pathname) => ({
				url: getTenantUrl(subdomain, pathname),
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: pathname === '/' ? 1 : 0.8,
			}))
			.concat(
				posts.map(({ slug, _modelApiKey, _updatedAt }) => ({
					url: getTenantUrl(
						subdomain,
						_modelApiKey === 'about'
							? `/om/${slug}`
							: _modelApiKey === 'news'
								? `/aktuellt/${slug}`
								: `/projekt/${slug}`,
					),
					lastModified: new Date(_updatedAt),
					changeFrequency: 'monthly',
					priority: 0.7,
				})),
			) as MetadataRoute.Sitemap;
		return sitemap;
	},
	manifest: async ({ params }: RouteContext<'/[subdomain]/manifest.json'>) => {
		const { subdomain } = await params;
		const { district } = await apiQuery(DistrictBySubdomainDocument, { variables: { subdomain } });

		return {
			name: `Konstfrämjandet - ${district?.name}`,
			short_name: `Konstfrämjandet - ${district?.name}`,
			description: `Konstfrämjandet - ${district?.name}`,
			start_url: '/',
			display: 'standalone',
			background_color: '#ffffff',
			theme_color: district?.color?.hex ?? '#000000',
			icons: [
				{
					src: '/favicon.ico',
					sizes: 'any',
					type: 'image/x-icon',
				},
			],
		} satisfies MetadataRoute.Manifest;
	},
	robots: async () => {
		return {
			rules: {
				userAgent: '*',
				allow: '/',
			},
		};
	},
	webPreviews: async (item) => {
		const { id } = item;
		const record = await client.items.find<District>(id);

		if (!record || !record.creator?.id) return null;

		const [user, districts, itemTypes] = await Promise.all([
			client.users.find(record.creator.id),
			client.items.list<District>({
				filter: { type: 'district' },
				version: 'published',
				page: { limit: 100 },
			}),
			client.itemTypes.list(),
		]);

		if (!user) return null;

		const district = districts.find((d) => d.email === user.email);
		const apiKey = itemTypes.find((t) => t.id === record.__itemTypeId)?.api_key;

		if (!apiKey) return null;
		if (!district) return null;
		const subdomain = district.subdomain as string;
		if (!subdomain) return null;
		const url = getTenantUrl(subdomain, getRoute({ ...record, _modelApiKey: apiKey }));
		return url;
	},
} satisfies DatoCmsConfig;
