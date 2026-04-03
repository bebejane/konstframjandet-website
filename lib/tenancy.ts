import districts from '@/districts.json';
import { stripStega } from '@datocms/content-link';
import { NextRequest } from 'next/server';
export const PRIMARY_SUBDOMAIN = 'forbundet';
export const BASE_DOMAIN =
	process.env.NODE_ENV === 'production' ? 'konstframjandet.se' : 'localhost:3000';
export const BASE_PROTOCOL = process.env.NODE_ENV === 'production' ? 'https://' : 'http://';

export function getTenantUrl(subdomain?: string, pathname = '/') {
	const prod = process.env.NODE_ENV === 'production';
	const sub =
		subdomain === PRIMARY_SUBDOMAIN
			? prod
				? 'www.'
				: ''
			: prod
				? `${subdomain}.`
				: `/${subdomain}`;

	const url = prod
		? `${BASE_PROTOCOL}${sub}${BASE_DOMAIN}${pathname}`
		: `${BASE_PROTOCOL}${BASE_DOMAIN}${sub}${pathname}`;

	return stripStega(url);
}

export function isTenantHome(pathname: string) {
	return pathname === '/' || districts?.some(({ subdomain }) => `/${subdomain}` === pathname);
}

export function getTenantSubdomain(req: NextRequest) {
	const prod = process.env.NODE_ENV === 'production';
	const pathname = req.nextUrl.pathname;
	const domain = req.headers.get('host') as string;
	const rootDomain = prod ? domain.split('.')[0] : pathname.split('/')[1];
	const subdomain = districts.find((d) => d.subdomain === rootDomain)?.subdomain;
	return subdomain ?? PRIMARY_SUBDOMAIN;
}
