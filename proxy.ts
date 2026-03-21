import { NextRequest, NextResponse } from 'next/server';
import { PRIMARY_SUBDOMAIN, BASE_DOMAIN } from '@/lib/tenancy';
import districts from './districts.json' assert { type: 'json' };

export default async function proxy(req: NextRequest) {
	const prod = process.env.NODE_ENV === 'production';
	const pathname = req.nextUrl.pathname;
	const domain = req.headers.get('host') as string;
	const subdomain = districts.find((d) => d.subdomain === pathname.split('/')[1])?.subdomain;
	const isAllowedDomain = domain === BASE_DOMAIN;

	if (!isAllowedDomain) return new Response(null, { status: 404 });

	if (prod) {
		return NextResponse.rewrite(new URL(`/${subdomain ?? PRIMARY_SUBDOMAIN}${pathname}`, req.url));
	} else {
		return NextResponse.rewrite(
			new URL(`${!subdomain ? `/${PRIMARY_SUBDOMAIN}${pathname}` : `${pathname}`}`, req.url),
		);
	}
}

export const config = {
	matcher: ['/((?!api/|_next/|_static/|_vercel|images|fonts|[\\w-]+\\.\\w+).*)'],
};
