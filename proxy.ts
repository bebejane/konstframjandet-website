import { NextRequest, NextResponse } from 'next/server';
import { PRIMARY_SUBDOMAIN, BASE_DOMAIN, BASE_PROTOCOL } from '@/lib/tenancy';
import districts from './districts.json' assert { type: 'json' };

export const config = {
	matcher: ['/((?!api/|_next/|_static/|_vercel|images|fonts|[\\w-]+\\.\\w+).*)'],
};

export default async function proxy(req: NextRequest) {
	const url = req.nextUrl;
	const hostname = req.headers.get('host') as string;
	const isAllowedDomain = hostname === BASE_DOMAIN;
	const subdomain = hostname.split('.')[0];
	console.log('proxy', url.pathname, subdomain);
	if (isAllowedDomain && !districts.some((d) => d.subdomain === subdomain)) {
		console.log('proxy: next');
		return NextResponse.next();
	}

	const subdomainData = districts.find((d) => d.subdomain === subdomain);

	if (subdomainData) {
		console.log('proxy: rewrite');
		return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));
	}
	console.log('proxy: 404');
	return new Response(null, { status: 404 });
}
