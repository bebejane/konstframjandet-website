export const PRIMARY_SUBDOMAIN = 'forbundet';
export const BASE_DOMAIN =
	process.env.NODE_ENV === 'production' ? 'konstframjandet.se' : 'localhost:3000';
export const BASE_PROTOCOL = process.env.NODE_ENV === 'production' ? 'https://' : 'http://';

export function getTenantUrl(subdomain: string, pathname: string) {
	const prod = process.env.NODE_ENV === 'production';
	const sub =
		subdomain === PRIMARY_SUBDOMAIN ? (prod ? 'www.' : '') : prod ? subdomain : `/${subdomain}`;
	return prod
		? `${BASE_PROTOCOL}${sub}${BASE_DOMAIN}${pathname}`
		: `${BASE_PROTOCOL}${BASE_DOMAIN}${sub}${pathname}`;
}
