import s from './NewsCard.module.scss'
import cn from 'classnames'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import format from 'date-fns/format'
import { Image } from 'react-datocms/image'
import Link from 'next/link'

export type CardProps = {
  news: NewsRecord
}

export default function NewsCard({ news: { title, intro, image, slug, address, where, date, time, misc } }: CardProps) {
  return (
    <li className={cn(s.card)}>
      <div className={s.content}>
        <h1>{title}</h1>
        <Markdown>
          {intro}
        </Markdown>
        <div className={s.meta}>
          {where}<br />
          {format(new Date(date), 'iiii d MMMM')}<br />
          {time}<br />
          {misc}
          <p>
            <Link href={`/aktuellt/${slug}`}>Läs mer</Link>
          </p>
        </div>
      </div>
      <figure className={s.figure}>
        <Image data={image.responsiveImage} className={s.image} />
      </figure>
    </li>
  )
}