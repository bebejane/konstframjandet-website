import { NextRequest, NextResponse } from 'next/server';
import districts from './districts.json' assert { type: 'json' };

export const config = {
	matcher: ['/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)'],
};

export default async function proxy(req: NextRequest) {
	const url = req.nextUrl;
	const hostname = req.headers.get('host') as string;

	// Se define una lista de dominios permitidos (incluyendo localhost y el dominio real)
	const allowedDomains = ['localhost:3000', 'konstframjandet.se'];

	// Verificamos si el hostname actual está en la lista de dominios permitidos
	const isAllowedDomain = allowedDomains.some((domain) => hostname.includes(domain));

	// Extraemos el posible subdominio de la URL
	const subdomain = hostname.split('.')[0];

	// Si estamos en un dominio permitido y no es un subdominio, permitimos la solicitud
	if (isAllowedDomain && !districts.some((d) => d.subdomain === subdomain)) {
		return NextResponse.next();
	}

	const subdomainData = districts.find((d) => d.subdomain === subdomain);

	if (subdomainData) {
		// Reescribe la URL a una ruta dinámica basada en el subdominio
		return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));
	}

	return new Response(null, { status: 404 });
}
