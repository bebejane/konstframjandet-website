import { District } from '@/types/datocms-cma';
import { basicAuth } from 'next-dato-utils/route-handlers';
import { client } from '@/lib/client';

export default async function POST(req: Request) {
	return basicAuth(req, async (req: Request) => {
		try {
			const body = await req.json();
			const event_type = body.event_type;
			const id = body?.entity?.id;
			const creatorId = body?.entity?.relationships?.creator?.data?.id;
			console.log({ id, event_type, creatorId });

			if (event_type !== 'upload' || !id || !creatorId) throw new Error('Invalid webhook call');

			const [upload, uploadCollections, users, districts] = await Promise.all([
				client.uploads.find(id),
				client.uploadCollections.list(),
				client.users.list(),
				client.items.list<District>({
					filter: { type: 'district' },
					version: 'published',
					page: { limit: 100 },
				}),
			]);

			const creator = users.find((u) => u.id === creatorId);
			const district = districts.find((d) => d.email === creator?.email);

			if (!creator) throw new Error('Invalid creator');
			if (!district) throw new Error('Invalid district');
			if (!upload) throw new Error('Invalid upload id');

			const { subdomain } = district;
			let districtUploadCollection = uploadCollections.find((c) => c.label === subdomain);

			if (!subdomain) throw new Error('Invalid district subdomain');

			if (!districtUploadCollection) {
				console.log('create new upload collection', subdomain);
				districtUploadCollection = await client.uploadCollections.create({ label: subdomain });
			}

			await client.uploads.bulkSetUploadCollection({
				uploads: [upload],
				upload_collection: {
					type: 'upload_collection',
					id: districtUploadCollection.id,
				},
			});

			return new Response(JSON.stringify({ success: true, subdomain }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			});
		} catch (error) {
			return new Response(
				JSON.stringify({
					success: false,
					error: typeof error === 'string' ? error : (error as Error).message,
				}),
				{
					status: 500,
					headers: { 'content-type': 'application/json' },
				},
			);
		}
	});
}
