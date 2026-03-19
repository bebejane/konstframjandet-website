import { apiQuery } from 'next-dato-utils/api';
import { DatoCmsConfig, getUploadReferenceRoutes, getItemReferenceRoutes } from 'next-dato-utils/config';
import { MetadataRoute } from 'next';

export default {
	// i18n: {
	// 	locales,
	// 	defaultLocale,
	// },
	routes: {
		
	},
	sitemap: async () => {
		// const { allPosts } = await apiQuery(AllPostsDocument, { all: true });
		// return [
		// 	{
		// 		url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
		// 		lastModified: new Date(),
		// 		changeFrequency: 'daily',
		// 		priority: 1,
		// 	},
		// ].concat(
		// 	allPosts.map((post) => ({
		// 		url: `${process.env.NEXT_PUBLIC_SITE_URL}/post/${post.slug}`,
		// 		lastModified: new Date(post._updatedAt),
		// 		changeFrequency: 'daily',
		// 		priority: 0.8,
		// 	}))
		// ) as MetadataRoute.Sitemap;
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
