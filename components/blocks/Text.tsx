import s from './Text.module.scss'
import cn from 'classnames'
import React from 'react'
import Link from 'next/link'
import { recordToSlug } from '/lib/utils'

export type TextBlockProps = {
  data: TextBlockRecord
}

export default function Text({ data: { text } }: TextBlockProps) {

  const href = link ? recordToSlug(link) : externalLink

  return (
    <section className={s.container}>
      <Link href={href}>
        {text}
      </Link>
    </section >
  )
}