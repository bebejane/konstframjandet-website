
import * as dotenv from 'dotenv'; dotenv.config({ path: "./.env" });
import { buildClient, Client, ApiError } from '@datocms/cma-client-node';
export const client: Client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN, environment: 'dev', extraHeaders: { 'X-Include-Drafts': 'true' } })

const main = async () => {
  try {

    const users = await client.users.list()
    const districts = await client.items.list({
      filter: { type: 'district' },
      version: 'published',
      page: { limit: 100 }
    })

    const uploads = []
    // this iterates over every page of results:
    for await (const upload of client.uploads.listPagedIterator({ page: { limit: 100 } })) {
      uploads.push(upload)
    }

    for (let i = 0, chunk = []; i < uploads.length; i++) {
      const upload = uploads[i];
      const user = users.find(u => u.id === upload.creator.id)
      const district = districts.find(d => d.email === user?.email)
      const subdomain = district?.subdomain as string

      if (subdomain) {
        chunk.push({ upload_id: upload.id, subdomain })
      }

      if (chunk.length >= 10 || i === uploads.length - 1) {
        console.log(`Processing ${i + 1}/${uploads.length} uploads`)
        await Promise.all(chunk.map(({ upload_id, subdomain }) => client.uploads.update(upload_id, { tags: [subdomain] })))
        chunk = []
      }
    }

  } catch (error) {
    console.log('err')

    if (error instanceof ApiError) {
      console.log(error.response)
    } else {
      console.log(error)
    }

  }
}

main()