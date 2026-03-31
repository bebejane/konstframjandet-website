import config from '@/datocms.config';

export async function GET(req: Request, { params }: RouteContext<'/[subdomain]/manifest.json'>) {
	const manifest = await config.manifest({ params });

	return new Response(JSON.stringify(manifest), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': `public, s-maxage=86400, stale-while-revalidate=${process.env.REVALIDATE_TIME!}`,
		},
	});
}
