import config from '@/datocms.config';
import type { NextRequest } from 'next/server';
import { apiQuery } from 'next-dato-utils/api';
import { SiteSearchDocument } from '@/graphql';
import { truncateText } from 'next-dato-utils/utils';
import { client } from '@/lib/client';

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
	try {
		console.time('search');
		const params = await req.json();
		const results = await siteSearch(params);
		console.timeEnd('search');
		return new Response(JSON.stringify(results), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch (err) {
		console.timeEnd('search');
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
		{ perPage: 500 },
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
	delete data.draftUrl;

	for (const type in data) {
		if (!data[type].length) {
			delete data[type];
			continue;
		}
		const items = data[type].filter((el) => el);
		const results = [];
		for (const item of items) {
			const d = {
				__typename: item.__typename,
				_modelApiKey: item._modelApiKey,
				category: itemTypes?.find(({ api_key }) => api_key === item._modelApiKey)?.name,
				title: item.title,
				text: truncateText(item.text, { sentences: 1, useEllipsis: true, minLength: 100 }),
				slug: await config.route(item),
			};
			results.push(d);
		}
		data[type] = results;
	}
	return data;
};
