import type { NextApiRequest, NextApiResponse } from 'next'
import { allDistricts, districtUrl } from '/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET' && req.query?.ping) {
    console.log('ping revalidate-district')
    return res.status(200).send('pong')
  }

  if (!basicAuth(req))
    return res.status(401).send('Access denied')

  const payload = req.body?.entity;
  const districtId = payload?.attributes?.district ?? payload?.id;
  const districts = await allDistricts()
  const district = districts.find(el => el.id === districtId)

  if (!district)
    return res.status(500).send('No district')

  const url = districtUrl(district)

  try {
    console.log(`revalidate-district: ${url}`)
    const response = await fetch(`${url}/api/revalidate`, {
      method: 'POST',
      body: JSON.stringify({ ...req.body }),
      headers: {
        'Authorization': 'Basic ' + Buffer.from(process.env.BASIC_AUTH_USER + ":" + process.env.BASIC_AUTH_PASSWORD).toString('base64'),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    return res.json(data)
  } catch (err) {
    return res.status(500).send(err.message || err)
  }
}

export const basicAuth = (req: NextApiRequest) => {

  const basicAuth = req.headers.authorization
  if (!basicAuth)
    return true;

  const auth = basicAuth.split(' ')[1]
  const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':')
  return user === process.env.BASIC_AUTH_USER && pwd === process.env.BASIC_AUTH_PASSWORD
}