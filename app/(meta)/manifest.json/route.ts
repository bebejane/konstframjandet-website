import config from '@/datocms.config';
import { NextRequest } from 'next/server';
import { getTenantSubdomain } from '@/lib/tenancy';

export async function GET(req: NextRequest, { params }: RouteContext<'/manifest.json'>) {
	const manifest = await config.manifest(getTenantSubdomain(req));

	return new Response(JSON.stringify(manifest), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': `public, s-maxage=86400, stale-while-revalidate=${process.env.REVALIDATE_TIME!}`,
		},
	});
}
