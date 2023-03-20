import s from './NewsCard.module.scss'
import cn from 'classnames'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import format from 'date-fns/format'
import { Image } from 'react-datocms/image'
import Link from 'next/link'
import { usePage } from '/lib/context/page'
import { capitalize } from '/lib/utils'

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
          {where && <span>{where}</span>}
          <span>{capitalize(format(new Date(date), 'd MMMM'))}</span>
          {time && <span>{time}</span>}
          {misc && <span>{misc}</span>}
          <span><Link href={`/aktuellt/${slug}`}>Läs mer</Link></span>
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