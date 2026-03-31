import { apiQuery } from 'next-dato-utils/api';
import { MenuDocument } from '@/graphql';
import { PRIMARY_SUBDOMAIN } from '@/lib/tenancy';

export type Menu = MenuItem[];

export type MenuItem = {
	type: string;
	label: string;
	slug?: string;
	subdomain?: string;
	items?: MenuItem[];
	color?: string;
};

const base: Menu = [
	{ type: 'home', label: 'Hem', slug: '/' },
	{ type: 'news', label: 'Aktuellt', slug: '/aktuellt', items: [] },
	{ type: 'project', label: 'Projekt', slug: '/projekt', items: [] },
	{ type: 'district', label: 'Distrikt', items: [] },
	{ type: 'about', label: 'Om', slug: '/om', items: [] },
	{ type: 'contact', label: 'Kontakt', slug: '/kontakt', items: [] },
];

export const buildMenu = async (districtId: string) => {
	const { allNews, allAbouts, allProjects, allDistricts } = await apiQuery(MenuDocument, {
		variables: { districtId, first: 100 },
		stripStega: true,
	});

	const district = allDistricts.find(({ id }) => id === districtId);

	let items: MenuItem[];
	const menu = base.map((item) => {
		switch (item.type) {
			case 'news':
				items = allNews.map((el) => ({
					type: 'news',
					label: el.title,
					slug: `/aktuellt/${el.slug}`,
				}));
				break;
			case 'about':
				items = allAbouts.map((el) => ({ type: 'about', label: el.title, slug: `/om/${el.slug}` }));
				items[0]?.slug && (item.slug = items[0]?.slug);
				break;
			case 'project':
				items = allProjects.map((el) => ({
					type: 'project',
					label: el.title,
					slug: `/projekt/${el.slug}`,
				}));
				break;
			case 'district':
				items = allDistricts
					.filter(({ subdomain }) => PRIMARY_SUBDOMAIN !== subdomain)
					.map((el) => ({
						type: 'district',
						label: el.name,
						slug: `/${el.subdomain}`,
						subdomain: el.subdomain,
					}));
				break;
			case 'contact':
				items = [
					{
						type: 'contact',
						label: 'Facebook',
						slug: district?.facebook!,
						subdomain: district?.subdomain,
					},
					{
						type: 'contact',
						label: 'Instagram',
						slug: district?.instagram!,
						subdomain: district?.subdomain,
					},
				];
				break;
			default:
				break;
		}
		return { ...item, items: items ?? item.items, subdomain: district?.subdomain };
	});

	return menu.filter(({ items }) => !(items && items.length === 0));
};
