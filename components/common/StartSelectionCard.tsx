import s from './StartSelectionCard.module.scss'
import cn from 'classnames'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import format from 'date-fns/format'
import { Image } from 'react-datocms/image'
import Link from 'next/link'

export type CardProps = {
  item: (NewsRecord | ProjectRecord)
}

export default function StartSelectionCard({ item }: CardProps) {

  const slug = item.__typename === 'NewsRecord' ? `/aktuellt/${item.slug}` : `/projekt/${item.slug}`
  const subdomain = item.district.subdomain

  return (
    <li className={s.card}>
      <Link href={slug} locale={subdomain}>
        <figure className={s.figure}>
          <Image
            data={item.image.responsiveImage}
            className={s.image}
            objectFit="cover"
            pictureStyle={{ WebkitMaskImage: `url(/images/mask1.png` }}
          />
        </figure>
      </Link>
      <Link href={slug} locale={subdomain}>
        <h2 className="mid">{item.title}</h2>
      </Link>
      <Markdown className="small">
        {item.intro}
      </Markdown>
      <Link href={slug} locale={subdomain} className={'small'}>
        Läs mer
      </Link>
    </li>
  )
}