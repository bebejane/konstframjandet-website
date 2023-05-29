import s from './NewsCard.module.scss'
import cn from 'classnames'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import { Image } from 'react-datocms/image'
import Link from 'next/link'
import { usePage } from '/lib/context/page'
import BalanceText from 'react-balance-text'
export type CardProps = {
  news: NewsRecord
  view?: 'list' | 'full'
}

export default function NewsCard({ view = 'full', news: { id, title, subtitle, intro, image, slug, where, date, time, misc } }: CardProps) {

  const { isHome } = usePage()

  return (
    <li id={id} className={cn(s.card, isHome && s.home, view === 'list' && s.list)}>
      <div className={s.content}>
        <Link href={`/aktuellt/${slug}`}>
          <h2 className="big"><BalanceText>{title}{subtitle && <span> — {subtitle}</span>}</BalanceText></h2>
        </Link>
        <Markdown className="big">
          {intro}
        </Markdown>
        <div className={cn(s.meta, "mid")}>
          {where && <span>{where}</span>}
          {date && <span>{date}</span>}
          {time && <span>{time}</span>}
          <span><Link href={`/aktuellt/${slug}`}>Läs mer</Link></span>
        </div>
      </div>
      {image?.responsiveImage &&
        <Link href={`/aktuellt/${slug}`}>
          <figure className={s.figure}>
            <Image data={image.responsiveImage} className={s.image} />
          </figure>
        </Link>
      }
    </li>
  )
}