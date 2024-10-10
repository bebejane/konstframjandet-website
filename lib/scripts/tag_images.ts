
import * as dotenv from 'dotenv'; dotenv.config({ path: "./.env" });
import { buildClient, Client, ApiError } from '@datocms/cma-client-node';
import { Upload } from '@datocms/cma-client/dist/types/generated/SimpleSchemaTypes';

const chunkArray = (array: any[], chunkSize: number) => {
  const newArr = []
  for (let i = 0; i < array.length; i += chunkSize)
    newArr.push(array.slice(i, i + chunkSize));
  return newArr
}

function checkIfDuplicateExists(arr) {
  return new Set(arr).size !== arr.length
}

export const client: Client = buildClient({
  apiToken: process.env.DATOCMS_API_TOKEN,
  //environment: 'dev',
  environment: 'main',
  extraHeaders: { 'X-Include-Drafts': 'true' }
})

const main = async () => {
  try {

    const users = await client.users.list()
    const uploadCollections = await client.uploadCollections.list();
    const districts = await client.items.list({
      filter: { type: 'district' },
      version: 'published',
      page: { limit: 100 }
    })
    const mainDistrict = districts.find(el => el.subdomain === 'forbundet')

    const uploads: Upload[] = []
    //console.log('Getting uploads...')

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

      if (upload.tags.includes(subdomain) && upload.upload_collection && upload.upload_collection?.id === upload_collection.id) {
        skipped.push(upload)
        continue;
      }

      districtUploads[subdomain].uploads.push(upload)

    }

    console.log(other.length)
    return

    for (const upload of other) {
      try {
        const refs = await client.uploads.references(upload.id)
        const allDistricts = refs.map(r => r.district).filter(el => el)
        const haveMultipleDistricts = !checkIfDuplicateExists(allDistricts) && allDistricts.length > 1

        const district = districts.find(({ id }) => {
          if (haveMultipleDistricts)
            return refs.some(r => r.district && allDistricts.filter(d => d !== mainDistrict.id).find((d) => d === id))
          else
            return refs.some(r => r.district === id)
        })

        const user = users.find(el => el.email === district?.email)

        if (district) {

          console.log(district.subdomain, user.email, upload.basename, haveMultipleDistricts)

          await client.uploads.update(upload.id, {
            creator: {
              type: "user",
              id: user.id
            }
          })
        }

      } catch (err) {
        console.log(err)
        return
      }
    }

    return process.exit(1)

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

  } catch (error) {
    console.log(error)
    if (error instanceof ApiError) {
      console.log(JSON.stringify(error.response))
    } else {
      console.log(JSON.stringify(error))
    }
  }
}

main()