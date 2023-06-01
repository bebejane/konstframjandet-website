import type { NextApiRequest, NextApiResponse } from 'next'
import { allDistricts, primarySubdomain } from '/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (!basicAuth(req))
    return res.status(401).send('Access denied')

  const payload = req.body?.entity;
  const districtId = payload?.attributes?.district ?? payload?.id;
  const districts = await allDistricts()
  const district = districts.find(el => el.id === districtId)

  if (!district)
    return res.status(500).send('No district')

  const domain = `${district.subdomain === primarySubdomain ? 'www' : district.subdomain}.konstframjandet.se`

  try {
    console.log(`revalidate subdomain: ${domain}`)
    await fetch(`https://${domain}/api/revalidate`, {
      method: 'POST',
      body: JSON.stringify({ ...req.body }),
      headers: {
        'Authorization': 'Basic ' + Buffer.from(process.env.BASIC_AUTH_USER + ":" + process.env.BASIC_AUTH_PASSWORD).toString('base64'),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    console.log(`revalidate subdomain: ${domain} done!`)
  } catch (err) {
    return res.status(500).send(err.message || err)
  }

  return res.json({ revalidated: true })
}

export const basicAuth = (req: NextApiRequest) => {

  const basicAuth = req.headers.authorization
  if (!basicAuth)
    return true;

  const auth = basicAuth.split(' ')[1]
  const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':')
  return user === process.env.BASIC_AUTH_USER && pwd === process.env.BASIC_AUTH_PASSWORD
}