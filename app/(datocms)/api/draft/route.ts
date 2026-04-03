import { getTenantSubdomain, getTenantUrl, PRIMARY_SUBDOMAIN } from '@/lib/tenancy';
import { draftMode } from 'next/headers';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<Response> {
	const url = new URL(request.url);
	const searchParams = url.searchParams;

	const check = searchParams.get('check');
	const secret = searchParams.get('secret');
	const origin = searchParams.get('origin');
	const slug = searchParams.get('slug') ?? searchParams.get('redirect') ?? '/';
	const exit = searchParams.get('exit');

	if (origin && origin !== url.origin) {
		const originUrl = new URL(origin);
		searchParams.forEach((value, key) => {
			originUrl.searchParams.set(key, value);
		});
		console.log('origin redirect:', originUrl.toString());
		return NextResponse.redirect(originUrl);
	}
	if (check) {
		const enabled = (await draftMode()).isEnabled;
		const secret = (await cookies()).get('secret')?.value;
		return new Response(JSON.stringify({ secret, enabled }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	if (exit !== null) {
		console.log('draft mode:', 'exit', slug);
		(await draftMode()).disable();
		return new Response('ok', { status: 307, headers: { Location: slug } });
	}

	if (secret !== process.env.DATOCMS_PREVIEW_SECRET) {
		return new Response('Invalid token', { status: 401 });
	} else {
		(await cookies()).set('secret', secret, {
			httpOnly: true,
			sameSite: 'none',
			secure: true,
			path: '/',
		});
	}

	if (!slug) {
		return new Response('Invalid slug', { status: 400 });
	}

	(await draftMode()).enable();

	if (slug) return new Response('OK', { status: 307, headers: { Location: slug } });
	else return new Response('OK', { status: 200 });
}
