import s from './StartText.module.scss'
import cn from 'classnames'
import React from 'react'
import Link from 'next/link'
import { DatoLink } from '/components'

export type TextBlockProps = {
  data: StartTextRecord
}

export default function StartText({ data: { text, link } }: TextBlockProps) {

  return (
    <section className={s.container}>
      <DatoLink link={link}>
        <h2>Om oss</h2>
        <div className={s.text}>
          <p className="brauer-intro">
            {text}
          </p>
          <span className="mid">Läs mer</span>
        </div>
      </DatoLink>
    </section >
  )
}