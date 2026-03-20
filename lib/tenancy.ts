export const PRIMARY_SUBDOMAIN = 'forbundet';
export const BASE_DOMAIN =
	process.env.NODE_ENV === 'production' ? 'konstframjandet.se' : 'localhost:3000';
export const BASE_PROTOCOL = process.env.NODE_ENV === 'production' ? 'https://' : 'http://';

export function getTenantUrl(subdomain: string, pathname: string) {
	return `${BASE_PROTOCOL}${subdomain === PRIMARY_SUBDOMAIN ? (process.env.NODE_ENV === 'production' ? 'www.' : '') : subdomain}${BASE_DOMAIN}/${pathname}`;
}
