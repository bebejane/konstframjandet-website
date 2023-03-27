import s from './StartText.module.scss'
import cn from 'classnames'
import React from 'react'
import Link from 'next/link'
import { recordToSlug } from '/lib/utils'

export type TextBlockProps = {
  data: StartTextRecord
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