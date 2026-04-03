import config from '@/datocms.config';
import { getTenantSubdomain } from '@/lib/tenancy';
import { MetadataRoute } from 'next';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: RouteContext<'/sitemap.xml'>) {
	const sitemap = await config.sitemap(getTenantSubdomain(req));
	const xml = generateSitemapXml(sitemap);

	return new Response(xml, {
		status: 200,
		headers: {
			'Content-Type': 'text/xml',
			'Cache-Control': `public, s-maxage=86400, stale-while-revalidate=${process.env.REVALIDATE_TIME!}`,
		},
	});
}

function generateSitemapXml(sitemap: MetadataRoute.Sitemap): string {
	const urlSet = sitemap
		.map(
			({ url, lastModified, changeFrequency, priority }) => `
    <url>
      <loc>${encodeURI(url)}</loc>
      ${lastModified ? `<lastmod>${new Date(lastModified).toISOString()}</lastmod>` : ''}
      ${changeFrequency ? `<changefreq>${changeFrequency}</changefreq>` : ''}
      ${priority ? `<priority>${priority}</priority>` : ''}
    </url>
  `,
		)
		.join('');

	return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urlSet}
  </urlset>`;
}
