import type { NextRequest, NextResponse } from 'next/server'
import { apiQuery } from 'dato-nextjs-utils/api';
import { buildClient } from '@datocms/cma-client';
import { SiteSearchDocument } from '/graphql';
import { truncateText, isEmptyObject, recordToSlug, primarySubdomain } from '/lib/utils';

const environment = process.env.DATOCMS_ENVIRONMENT ?? process.env.NEXT_PUBLIC_DATOCMS_ENVIRONMENT ?? 'main'
const client = buildClient({ apiToken: process.env.GRAPHQL_API_TOKEN, environment });

export const config = {
  runtime: 'edge',
}

export type SearchResult = {
  [index: string]: {
    __typename: 'AboutRecord' | 'NewsRecord' | 'ProjectRecord' | 'ProjectSubpageRecord'
    _apiKey: string
    category: string
    title: string
    text: string
    slug: string
  }[]
}

export default async function handler(req: NextRequest, res: NextResponse) {

  console.log('search')
  try {

    const params = await req.json();
    const results = await siteSearch(params)
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    })

  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    })
  }
}


export const searchModel = async (query, model, districtId) => {

  const result = []
  for await (const record of client.items.listPagedIterator({
    filter: {
      type: model,
      query,
      fields: {
        district: {
          eq: districtId
        }
      }
    },
    order_by: '_rank_DESC',
  }, {
    perPage: 100,
  })) {
    result.push(record)
  }

  return result
}


export const siteSearch = async (opt: any) => {

  const { q, district } = opt;

  if (!q) return {}

  const variables = { query: q ? `${q.split(' ').filter(el => el).join('|')}` : undefined };

  if (isEmptyObject(variables))
    return {}

  console.log('site search', q, district)

  const itemTypes = await client.itemTypes.list();
  const models = ['about', 'project', 'project_subpage', 'news']
  const result = await Promise.all(models.map(model => searchModel(variables.query, model, district)))
  const search = result.flat().map(el => ({ ...el, _api_key: itemTypes.find((t) => t.id === el.item_type.id).api_key }))

  const data: { [key: string]: any[] } = {}
  const first = 100

  for (let i = 0; i < search.length; i += first) {
    const chunk = search.slice(i, first - 1)
    const variables = {
      aboutIds: chunk.filter(el => el._api_key === 'about').map(el => el.id),
      newsIds: chunk.filter(el => el._api_key === 'news').map(el => el.id),
      projectIds: chunk.filter(el => el._api_key === 'project').map(el => el.id),
      projectSubpageIds: chunk.filter(el => el._api_key === 'project_subpage').map(el => el.id),
      districtId: district,
      first,
      skip: i
    }

    const res = await apiQuery(SiteSearchDocument, { variables })

    Object.keys(res).forEach((k) => {
      data[k] = data[k] ?? [];
      data[k] = data[k].concat(res[k])
    })
  }

  Object.keys(data).forEach(type => {
    if (!data[type].length)
      delete data[type]
    else
      data[type] = data[type].map(el => ({
        __typename: el.__typename,
        _modelApiKey: el._modelApiKey,
        category: itemTypes.find(({ api_key }) => api_key === el._modelApiKey).name,
        title: el.title,
        text: truncateText(el.text, { sentences: 1, useEllipsis: true, minLength: 100 }),
        slug: `${el.district?.subdomain !== primarySubdomain ? `/${el.district?.subdomain}` : ''}${recordToSlug(el)}` //TODO: change to real subdomains
      }))
  })
  return data;
}
