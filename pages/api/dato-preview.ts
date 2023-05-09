import type { NextApiRequest, NextApiResponse } from 'next'
import { allDistricts, primarySubdomain } from '/lib/utils';
import { apiQuery } from 'dato-nextjs-utils/api';
import { ProjectBySubpageDocument } from '/graphql';

const generatePreviewUrl = async ({ item, itemType, locale }) => {

  let path = null;
  const { slug, district: districtId } = item.attributes
  const district = districtId ? (await allDistricts()).find(({ id }) => id === districtId) : undefined
  const districtSlug = district && district.subdomain !== primarySubdomain ? `/${district.subdomain}` : '' //TODO: change to real subdomains

  switch (itemType.attributes.api_key) {
    case 'news':
      path = `/aktuellt/${slug}`;
      break;
    case 'about':
      path = `/om/${slug}`;
      break;
    case 'project':
      path = `/projekt/${slug}`;
      break;
    case 'project_subpage':
      const { project } = await apiQuery(ProjectBySubpageDocument, { variables: { subpageId: item.id } })
      project && (path = `/projekt/${project.slug}/${slug}`)
      break;
    case 'district':
      path = '/';
      break;
    default:
      break;
  }

  return path ? `${districtSlug}${path}` : null
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).send('ok');

  const url = await generatePreviewUrl(req.body);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL //TODO: change to real subdomains
  const previewLinks = !url ? [] : [{
    label: 'Live',
    url: `${baseUrl}${url}`
  }, {
    label: 'Utkast',
    url: `${baseUrl}/api/preview?slug=${url}&secret=${process.env.DATOCMS_PREVIEW_SECRET}`,
  }]

  return res.status(200).json({ previewLinks });
};




/*
export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest, res: NextResponse) {

  const body = await req.json();

  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.headers.set('Content-Type', 'application/json');

  // This will allow OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200 })
  }

  const url = generatePreviewUrl(body);
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.URL;
  const previewLinks = !url ? [] : [{
    label: 'Live',
    url: `${baseUrl}${url}`
  }, {
    label: 'Utkast',
    url: `${baseUrl}/api/preview?slug=${url}&secret=${process.env.DATOCMS_PREVIEW_SECRET}`,
  }]
  console.log(previewLinks)
  return new Response(JSON.stringify({ previewLinks }), { status: 200, headers: { 'content-type': 'application/json' } })
};

*/