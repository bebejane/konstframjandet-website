import s from './NewsCard.module.scss'
import cn from 'classnames'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import format from 'date-fns/format'
import { Image } from 'react-datocms/image'
import Link from 'next/link'
import { usePage } from '/lib/context/page'

export type CardProps = {
  news: NewsRecord
}

export default function NewsCard({ news: { title, intro, image, slug, address, where, date, time, misc } }: CardProps) {

  const { isHome } = usePage()

  return (
    <li className={cn(s.card, isHome && s.home)}>
      <div className={s.content}>
        <Link href={`/aktuellt/${slug}`}>
          <h2 className="big">{title}</h2>
        </Link>
        <Markdown className="big">
          {intro}
        </Markdown>
        <div className={cn(s.meta, "mid")}>
          {where}<br />
          {format(new Date(date), 'iiii d MMMM')}<br />
          {time}<br />
          {misc}
          <p>
            <Link href={`/aktuellt/${slug}`}>Läs mer</Link>
          </p>
        </div>
      </div>
      <Link href={`/aktuellt/${slug}`}>
        <figure className={s.figure}>
          <Image data={image.responsiveImage} className={s.image} />
        </figure>
      </Link>
    </li>
  )
}