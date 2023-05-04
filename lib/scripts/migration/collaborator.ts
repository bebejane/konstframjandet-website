import { allDistricts, client } from "./";
//import { buildClient } from '@datocms/cma-client-node';

//const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN, environment: 'main', extraHeaders: { 'X-Include-Drafts': 'true' } })

export const updateAllCollaborator = async () => {

  console.time('update')
  console.log(`-- update collaborator on assets/records/`)

  const users = await client.users.list()
  const districts = await allDistricts()

  console.timeEnd('update')
}

export const updateCollaborator = async (subdomain: string) => {

  console.time('update')
  console.log(`-- ${subdomain} -----------------------------------`)
  console.log(`update collaborator on assets/records/`)

  const users = await client.users.list()
  const districts = await allDistricts()
  const district = districts.find(el => el.subdomain === subdomain)

  if (!district)
    throw new Error(`district not found for ${subdomain}`)

  const districtId = district.id
  const user = users.find(el => el.email === district.email)

  if (!user) throw new Error(`user not found for ${district.name}`)

  let total = 0
  let updated = 0
  let uploadsTotal = 0
  let uploadsUpdated = 0

  for await (const record of client.items.listPagedIterator({ version: 'all' })) {
    total++
    if (record.district === districtId) {
      process.stdout.write('.')
      await client.items.update(record.id, { creator: { type: "user", id: user.id } })
      updated++
    }
  }

  for await (const upload of client.uploads.listPagedIterator()) {
    uploadsTotal++
    if (upload.tags.includes(subdomain)) {
      await client.uploads.update(upload.id, { creator: { type: "user", id: user.id } })
      process.stdout.write('#')
      uploadsUpdated++
    }

  }

  console.log('\n')
  console.log(`records: ${updated}/${total}`)
  console.log(`uploads: ${uploadsUpdated}/${uploadsTotal}`)
  console.timeEnd('update')
}

const district = process.argv[2]?.trim()

if (district)
  updateCollaborator(district)