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
        <h2>Om oss</h2>
        <div className={s.text}>
          <p className="intro">
            {text}
          </p>
          <span className="mid">Läs mer</span>
        </div>

      </Link>
    </section >
  )
}