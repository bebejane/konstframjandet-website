import { withRevalidate } from 'dato-nextjs-utils/hoc'
import { sleep } from '/lib/utils';
import districts from '/lib/districts.json'

export default withRevalidate(async (record, revalidate) => {

  const { api_key: apiKey, } = record.model;
  const { slug, _payload: payload } = record

  const paths = []
  const districtId = payload?.attributes?.district;
  const district = districts.find(el => el.id === districtId)
  const { revalidateSubdomain } = payload

  switch (apiKey) {
    case 'about':
      paths.push(`/om/${slug}`)
      break;
    case 'project':
      paths.push(`/projekt/${slug}`)
      break;
    case 'news':
      paths.push(`/nyheter/${slug}`)
      break;
    default:
      break;
  }

  if (revalidateSubdomain)
    return revalidate(paths)

  if (!district)
    return console.log('no district found in payload')

  const domain = `${district.subdomain}.konstframjandet.se`
  console.log(`revalidate subdomain: ${domain}`)
  revalidate([])
  /*
  await fetch(`https://${domain}/api/revalidate`, {
    method: 'POST',
    body: JSON.stringify({ entity: { ...payload, revlidateSubdomain: true } }),
    headers: {
      'Authorization': 'Basic ' + btoa(process.env.BASIC_AUTH_USER + ":" + process.env.BASIC_AUTH_PASSWORD),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  */
})