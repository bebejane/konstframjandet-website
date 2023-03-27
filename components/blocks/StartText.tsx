import s from './StartText.module.scss'
import cn from 'classnames'
import React from 'react'
import Link from 'next/link'
import { recordToSlug } from '/lib/utils'

export type TextBlockProps = {
<<<<<<< HEAD:components/blocks/Text.tsx
  data: TextBlockRecord
=======
  data: StartTextRecord
>>>>>>> 302d082999ac6561275e3e906fe1f01a12647ee5:components/blocks/StartText.tsx
}

export default function StartText({ data: { text, href } }: TextBlockProps) {

  return (
    <section className={s.container}>
      <Link href={href}>
        {text}
      </Link>
    </section >
  )
}