import { NextRequest, NextResponse } from 'next/server';
import districts from './districts.json' assert { type: 'json' };

export const config = {
	matcher: ['/((?!api/|_next/|_static/|_vercel|sitemap.xml|robots.txt|[\\w-]+\\.\\w+).*)'],
};

export default async function proxy(req: NextRequest) {
	const url = req.nextUrl;
	const hostname = req.headers.get('host') as string;
	const allowedDomains = ['localhost:3000', 'konstframjandet.se'];
	const isAllowedDomain = allowedDomains.some((domain) => hostname.includes(domain));
	const subdomain = hostname.split('.')[0];

	if (isAllowedDomain && !districts.some((d) => d.subdomain === subdomain))
		return NextResponse.next();

	const subdomainData = districts.find((d) => d.subdomain === subdomain);

	if (subdomainData) return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));

	return new Response(null, { status: 404 });
}
