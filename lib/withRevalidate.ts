import type { NextApiRequest, NextApiResponse } from 'next'
import { buildClient } from '@datocms/cma-client';

export const basicAuth = (req: NextApiRequest) => {

  const basicAuth = req.headers.authorization
  if (!basicAuth)
    return true;

  const auth = basicAuth.split(' ')[1]
  const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':')
  return user === process.env.BASIC_AUTH_USER && pwd === process.env.BASIC_AUTH_PASSWORD
}

const recordFromPayload = async (payload: any): Promise<any> => {

  const modelId = payload?.relationships?.item_type?.data?.id

  if (!modelId)
    throw 'Model id not found in payload!'

  const client = buildClient({ apiToken: process.env.GRAPHQL_API_TOKEN || process.env.NEXT_PUBLIC_GRAPHQL_API_TOKEN, requestTimeout: 3000 })
  const models = await client.itemTypes.list()
  const model = models.find(m => m.id === modelId)
  const records = await client.items.list({ filter: { type: model.api_key, fields: { id: { eq: payload.id } } } })
  const record = records[0]

  if (!record)
    throw `No record found with modelId: ${modelId} (${model.api_key})`

  console.log('revalidate', model.api_key)
  return { ...record, model }

}

export default function withRevalidate(callback: (record: any, revalidate: (paths: string[]) => Promise<void>) => Promise<void>): (req: NextApiRequest, res: NextApiResponse) => void {

  return async (req: NextApiRequest, res: NextApiResponse) => {

    if (!basicAuth(req))
      return res.status(401).send('Access denied')

    const payload = req.body?.entity;

    if (!payload)
      throw 'Payload is empty'

    const record = await recordFromPayload(payload)
    record._payload = payload

    callback(record, async (paths) => {
      try {
        if (!paths.length)
          throw 'Nothing to revalidate';

        console.log('revalidating paths', paths)
        await Promise.all(paths.map(p => res.revalidate(p)))
        console.log('revalidating done!')
        return res.json({ revalidated: true, paths })
      } catch (err) {
        console.error(err)
        return res.json({ revalidated: false, err })
      }

    })
  }
}


