import { withRevalidate } from 'dato-nextjs-utils/hoc'
import { sleep } from '/lib/utils';
import districts from '/lib/districts.json'

export default withRevalidate(async (record, revalidate) => {

  const { _payload: payload } = record

  const districtId = payload?.attributes?.district;
  const district = districts.find(el => el.id === districtId)

  if (!district)
    return

  const domain = `${district.subdomain}.konstframjandet.se`
  console.log(`revalidate subdomain plsss: ${domain}`)

  fetch(`https://${domain}/api/revalidate`, {
    method: 'POST',
    body: JSON.stringify({ entity: { ...payload } }),
    headers: {
      'Authorization': 'Basic ' + Buffer.from(process.env.BASIC_AUTH_USER + ":" + process.env.BASIC_AUTH_PASSWORD).toString('base64'),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(() => console.log('sent req')).catch(err => console.error(err))
})