
import * as dotenv from 'dotenv'; dotenv.config({ path: "./.env" });
import { buildClient, Client, ApiError } from '@datocms/cma-client-node';
export const client: Client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN, environment: 'main', extraHeaders: { 'X-Include-Drafts': 'true' } })

const main = async () => {
  try {

    const webhook = (await client.webhooks.list()).find((webhook) => webhook.name === 'Revalidate district');
    //console.log(webhook)

    // this iterates over every page of results:
    for await (const webhookCall of client.webhookCalls.listPagedIterator({ webhookId: webhook.id, perPage: 100 })) {
      console.log(webhookCall.response_payload)
      //console.log(webhookCall.webhook, webhookCall.created_at);
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