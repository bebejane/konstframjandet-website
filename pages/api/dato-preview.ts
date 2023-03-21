import type { NextRequest, NextResponse } from 'next/server'
//import { primarySubdomain } from '/lib/utils';
export const config = {
  runtime: 'edge',
}

const generatePreviewUrl = ({ item, itemType, locale }) => {
  const { slug, district } = item.attributes

  switch (itemType.attributes.api_key) {
    case 'news':
      return `/aktuellt/${slug}`;
    case 'about':
      return `/om/${slug}`;
    case 'project':
      return `/projekt/${slug}`;
    case 'project_subpage':
      return `/projekt/${slug}`;
    default:
      return null;
  }
};

export default async function handler(req: NextRequest, res: NextResponse) {

  const body = await req.json();

  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.headers.set('Content-Type', 'application/json');

  // This will allow OPTIONS request
  if (req.method === 'OPTIONS') {

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

