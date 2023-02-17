import { withRevalidate } from 'dato-nextjs-utils/hoc'
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

  if (!revalidateSubdomain) {
    console.log('revalidate subdomain req')
    console.log({ ...payload, revalidateSubdomain: true })

    try {
      await fetch(`https://${district.subdomain}.konstframjandet.se/api/revalidate`, {
        method: 'POST',
        body: JSON.stringify({ ...payload, revalidateSubdomain: true }),
        headers: {
          'Authorization': 'Basic ' + btoa(process.env.BASIC_AUTH_USER + ":" + process.env.BASIC_AUTH_PASSWORD),
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
    } catch (err) {
      console.error(err)
    }
    revalidate([])
  } else {
    console.log('revalidate district', district?.name, paths)
    revalidate(paths)
  }
})