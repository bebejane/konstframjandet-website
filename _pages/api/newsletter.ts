import { NextRequest, NextResponse } from 'next/server'
import { isEmail } from '/lib/utils';

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest, res: NextResponse) {
  const { email } = await req.json();

  if (!isEmail(email)) {
    return NextResponse.json({ error: 'E-post adress är ogiltig' }, {
      status: 400,
      headers: { 'content-type': 'application/json' }
    })
  }

  try {

    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const DATACENTER = process.env.MAILCHIMP_API_SERVER;
    const data = { email_address: email, status: 'subscribed' };

    const response = await fetch(`https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'Authorization': `apikey ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const { title, status, detail } = await response.json()

    if (status >= 400) {
      const exists = title?.toLowerCase().includes('exists') ?? false
      return NextResponse.json({
        success: false,
        error: exists ? 'Du är redan anmäld till nyhetsbrevet' : `Det uppstod ett fel: ${detail}`,
      }, {
        status: 400,
        headers: { 'content-type': 'application/json' }
      })
    }

    return NextResponse.json({ success: true }, {
      status: 201,
      headers: { 'content-type': 'application/json' }
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || error.toString() }, {
      status: 500,
      headers: { 'content-type': 'application/json' }
    })
  }
};