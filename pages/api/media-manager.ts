import { NextRequest, NextResponse } from 'next/server'
import { buildClient, Client, ApiError } from '@datocms/cma-client-browser';
import { Upload } from '@datocms/cma-client/dist/types/generated/SimpleSchemaTypes';
import { withVercelCronAuthEdge } from 'dato-nextjs-utils/hoc/';

export const config = {
  runtime: 'edge',
}

export const client: Client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN, extraHeaders: { 'X-Include-Drafts': 'true' } })

const chunkArray = (array: any[], chunkSize: number) => {
  const newArr = []
  for (let i = 0; i < array.length; i += chunkSize)
    newArr.push(array.slice(i, i + chunkSize));
  return newArr
}

export default withVercelCronAuthEdge(async (req: NextRequest, res: NextResponse) => {

  try {

    const users = await client.users.list()
    const uploadCollections = await client.uploadCollections.list();
    const districts = await client.items.list({
      filter: { type: 'district' },
      version: 'published',
      page: { limit: 100 }
    })

    const uploads: Upload[] = []
    console.log('Getting uploads...')
    // this iterates over every page of results:
    for await (const upload of client.uploads.listPagedIterator({ perPage: 500 })) {
      uploads.push(upload)
    }

    const other: Upload[] = []
    const skipped: Upload[] = []
    const districtUploads = {}

    for (let i = 0; i < uploads.length; i++) {
      const upload = uploads[i];
      const user = users.find(u => u.id === upload.creator.id)
      const district = districts.find(d => d.email === user?.email)
      const subdomain = district?.subdomain as string

      if (!subdomain) {
        other.push(upload)
        continue;
      }

      let upload_collection = uploadCollections.find(c => c.label === subdomain)

      if (!upload_collection) {
        upload_collection = await client.uploadCollections.create({ label: subdomain })
        uploadCollections.push(upload_collection)
      }

      if (!districtUploads[subdomain])
        districtUploads[subdomain] = { uploads: [], tags: [subdomain], upload_collection }

      if (upload.tags.includes(subdomain) && upload.upload_collection.id === upload_collection.id) {
        skipped.push(upload)
        continue;
      }

      districtUploads[subdomain].uploads.push(upload)

    }

    for (const [subdomain] of Object.entries(districtUploads)) {
      const { uploads, tags, upload_collection } = districtUploads[subdomain]
      if (!uploads.length) continue;
      console.log('Updating', subdomain, uploads.length)
      const chunks = chunkArray(uploads, 100)
      for (let i = 0; i < chunks.length; i++) {
        await client.uploads.bulkSetUploadCollection({ uploads: chunks[i], upload_collection })
        await client.uploads.bulkTag({ uploads: chunks[i], tags })
      }
    }

    console.log('Uploads:', uploads.length, 'Skipped:', skipped.length, 'Other:', other.length)

    return NextResponse.json({ success: true }, {
      status: 200,
      headers: { 'content-type': 'application/json' }
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      success: false,
      error: error.message || error.toString()
    }, {
      status: 500,
      headers: { 'content-type': 'application/json' }
    })
  }
});