import { NextRequest, NextResponse } from 'next/server';
import { PRIMARY_SUBDOMAIN, BASE_DOMAIN, getTenantSubdomain } from '@/lib/tenancy';

export default async function proxy(req: NextRequest) {
	const prod = process.env.NODE_ENV === 'production';
	const pathname = req.nextUrl.pathname;
	const domain = req.headers.get('host') as string;
	const subdomain = getTenantSubdomain(req);
	const isAllowedDomain = !subdomain ? domain.endsWith(BASE_DOMAIN) : true;
	if (!isAllowedDomain) return new Response(null, { status: 404 });

	if (prod)
		return NextResponse.rewrite(new URL(`/${subdomain ?? PRIMARY_SUBDOMAIN}${pathname}`, req.url));
	else
		return NextResponse.rewrite(
			new URL(`${subdomain === PRIMARY_SUBDOMAIN ? `/${subdomain}` : ''}${pathname}`, req.url),
		);
}

export const config = {
	matcher: ['/((?!api/|_next/|_static/|_vercel|images|fonts|sitemap.xml|[\\w-]+\\.\\w+).*)'],
};
