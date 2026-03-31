import config from '@/datocms.config';
import { basicAuth } from 'next-dato-utils/route-handlers';
import { getTenantUrl, PRIMARY_SUBDOMAIN } from '@/lib/tenancy';
import { apiQuery } from 'next-dato-utils/api';
import { AllDistrictsDocument } from '@/graphql';

export async function POST(req: Request) {
	return basicAuth(req, async (req) => {
		const body = await req.json();
		const payload = body?.entity;
		const districtId = payload?.attributes?.district ?? payload?.id;
		const { allDistricts } = await apiQuery(AllDistrictsDocument);
		const district =
			allDistricts.find((el) => el.id === districtId) ??
			allDistricts.find((el) => el.subdomain === PRIMARY_SUBDOMAIN);

		if (!district)
			return new Response(JSON.stringify({ error: 'District not found' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});

		const url = getTenantUrl(district.subdomain, '/');

		try {
			console.log(`revalidate-district: ${url}`);
			const response = await fetch(`${url}/api/revalidate`, {
				method: 'POST',
				body: JSON.stringify({ ...body }),
				headers: {
					'Authorization':
						'Basic ' +
						Buffer.from(
							process.env.BASIC_AUTH_USER + ':' + process.env.BASIC_AUTH_PASSWORD,
						).toString('base64'),
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();
			return new Response(JSON.stringify(data), {
				status: response.status,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (err) {
			return new Response(
				JSON.stringify({ error: typeof err === 'string' ? err : (err as Error).message }),
				{
					status: 500,
					headers: { 'Content-Type': 'application/json' },
				},
			);
		}
	});
}
