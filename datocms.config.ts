import { apiQuery } from 'next-dato-utils/api';
import {
	DatoCmsConfig,
	getUploadReferenceRoutes,
	getItemReferenceRoutes,
} from 'next-dato-utils/config';
import { MetadataRoute } from 'next';
import { DistrictBySubdomainDocument, ProjectBySubpageDocument, SitemapDocument } from '@/graphql';
import { getTenantUrl } from '@/lib/tenancy';

export default {
	routes: {
		start: async () => ['/'],
		about: async () => ['/om'],
		news: async ({ id, slug }) => [
			`/aktuellt/${slug}`,
			'/aktuellt',
			...(await getItemReferenceRoutes(id)),
		],
		project: async ({ id, slug }) => [`/projekt/${slug}`, ...(await getItemReferenceRoutes(id))],
		project_subpage: async ({ id }) => {
			const { project } = await apiQuery(ProjectBySubpageDocument, {
				variables: { subpageId: id },
			});
			return project ? [`/projekt/${project.slug}`, ...(await getItemReferenceRoutes(id))] : null;
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
	manifest: async () => {
		return {
			name: 'Konstfrämjandet',
			short_name: 'Konstfrämjandet',
			description: 'Konstfrämjandet',
			start_url: '/',
			display: 'standalone',
			background_color: '#ffffff',
			theme_color: '#000000',
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
} satisfies DatoCmsConfig;
