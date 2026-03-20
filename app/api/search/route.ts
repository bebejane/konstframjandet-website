import config from '@/datocms.config';
import type { NextRequest } from 'next/server';
import { apiQuery } from 'next-dato-utils/api';
import { buildClient } from '@datocms/cma-client';
import { SiteSearchDocument } from '@/graphql';
import { truncateText, recordToSlug } from '@/lib/utils';
import { PRIMARY_SUBDOMAIN } from '@/lib/tenancy';

const environment =
	process.env.DATOCMS_ENVIRONMENT ?? process.env.NEXT_PUBLIC_DATOCMS_ENVIRONMENT ?? 'main';
const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN!, environment });

export type SearchResult = {
	[index: string]: {
		__typename: 'AboutRecord' | 'NewsRecord' | 'ProjectRecord' | 'ProjectSubpageRecord';
		_apiKey: string;
		category: string;
		title: string;
		text: string;
		slug: string;
	}[];
};

export async function POST(req: NextRequest) {
	console.log('search');
	try {
		const params = await req.json();
		const results = await siteSearch(params);
		return new Response(JSON.stringify(results), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify(err), {
			status: 500,
			headers: { 'content-type': 'application/json' },
		});
	}
}

export const searchModel = async (query: string, model: string, districtId: string) => {
	const result = [];
	for await (const record of client.items.listPagedIterator(
		{
			order_by: '_rank_DESC',
			filter: {
				type: model,
				query,
				fields: {
					district: {
						eq: districtId,
					},
				},
			},
		},
		{ perPage: 100 },
	)) {
		result.push(record);
	}
	return result;
};

export const siteSearch = async (opt: { q: string; district: string }) => {
	const { q, district } = opt;

	if (!q) return {};

	const variables: { query?: string } = {
		query: q
			? `${q
					.split(' ')
					.filter((el) => el)
					.join('|')}`
			: undefined,
	};

	if (!variables?.query) return {};

	console.log('site search', q, district);

	const itemTypes = await client.itemTypes.list();
	const models = ['about', 'project', 'project_subpage', 'news'];
	const result = await Promise.all(
		models.map((model) => searchModel(variables.query!, model, district)),
	);
	const search = result
		.flat()
		.map((el) => ({ ...el, _api_key: itemTypes?.find((t) => t.id === el.item_type.id)?.api_key }));

	const data: { [key: string]: any[] } = {};
	const first = 100;

	for (let i = 0; i < search.length; i += first) {
		const chunk = search.slice(i, first - 1);
		const variables = {
			aboutIds: chunk.filter((el) => el._api_key === 'about').map((el) => el.id),
			newsIds: chunk.filter((el) => el._api_key === 'news').map((el) => el.id),
			projectIds: chunk.filter((el) => el._api_key === 'project').map((el) => el.id),
			projectSubpageIds: chunk.filter((el) => el._api_key === 'project_subpage').map((el) => el.id),
			districtId: district,
			first,
			skip: i,
		};

		const res = await apiQuery(SiteSearchDocument, { variables });

		Object.keys(res).forEach((k) => {
			data[k] = data[k] ?? [];
			data[k] = data[k].concat(res[k as keyof typeof res]);
		});
	}

	Object.keys(data).forEach((type) => {
		if (!data[type].length) delete data[type];
		else
			data[type] = data[type]
				.filter((el) => el)
				.map((el) => ({
					__typename: el.__typename,
					_modelApiKey: el._modelApiKey,
					category: itemTypes?.find(({ api_key }) => api_key === el._modelApiKey)?.name,
					title: el.title,
					text: truncateText(el.text, { sentences: 1, useEllipsis: true, minLength: 100 }),
					slug: `${el.district?.subdomain !== PRIMARY_SUBDOMAIN ? `/${el.district?.subdomain}` : ''}${recordToSlug(el)}`,
					//TODO: change to real subdomains
				}));
	});
	return data;
};
