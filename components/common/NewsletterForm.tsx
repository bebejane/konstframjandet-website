import s from './NewsletterForm.module.scss'
import Loader from '/components/common/Loader';
import cn from 'classnames'

import { useState } from 'react'
import { isEmail } from "/lib/utils";

export default function NewsletterForm() {

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isEmail(email)) return setError('E-post adress ogiltig')

    setSuccess(false)
    setError(undefined)
    setSubmitting(true)

    //setTimeout(() => setSubmitting(true), 0)
    //setTimeout(() => setSuccess(true), 2000)
    //setTimeout(() => setSubmitting(false), 2000)
    //return


    fetch('/api/newsletter', {
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    }).then(async (res) => {
      const { success, error } = await res.json()
      setSuccess(success)
      setError(error)
    }).catch((err) => setError(err))
      .finally(() => setSubmitting(false))
  }

  return (
    <div className={s.newsletter}>
      <p className="mid">Nationellt nyhetsbrev</p>
      <p className="body-small">
        Anmäl dig till Konstfrämjandets nationella nyhetsbrev här, för information om Konstfrämjandets händelser i hela landet.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          id="email"
          name="email"
          type="email"
          className="small"
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
          placeholder="E-post address..."
          autoCapitalize="off"
          autoCorrect="off"
        />
        {error && <div className={cn(s.error)}>Fel: {error}</div>}
        <button className="small">Skicka</button>
      </form>
      {submitting && <div className={s.overlay}><Loader /></div>}
      {success &&
        <div className={cn(s.overlay, 'mid')}>
          Tack för din anmälan!
        </div>
      }
    </div >
  )

}