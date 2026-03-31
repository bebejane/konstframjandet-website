import 'dotenv/config';
import {
	DatoCmsConfig,
	getItemApiKey,
	getUploadReferenceRoutes,
	getItemReferenceRoutes,
} from 'next-dato-utils/config';
import { getRoute } from '@/datocms.config';
import { client } from '@/lib/client';
const item = {
	__typename: 'AboutRecord',
	_modelApiKey: 'about',
	category: 'Om',
	title: 'Vår historia',
	text: 'Folkrörelsernas Konstfrämjande bildades 1947 med uppdraget att demokratisera konsten och göra den tillgänglig för en bredare allmänhet....',
	slug: '/',
};

async function search(query: string) {
	const { data, meta } = await client.searchResults.rawList({
		filter: {
			fuzzy: false,
			query,
			search_index_id: process.env.DATOCMS_SEARCH_INDEX_ID,
		},
		page: {
			limit: 20,
			offset: 0,
		},
	});
	return data;
}

async function reIndex() {
	const res = await client.searchIndexes.trigger(process.env.DATOCMS_SEARCH_INDEX_ID!);
	return res;
}

async function main() {
	//const res = await reIndex();
	const res = await search('konst');
	console.log(res);
}
main();
