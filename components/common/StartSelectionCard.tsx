import s from './StartSelectionCard.module.scss'
import cn from 'classnames'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import { Image } from 'react-datocms/image'
import Link from 'next/link'
import { recordToSlug, districtUrl } from '/lib/utils'

export type CardProps = {
  item: (NewsRecord | ProjectRecord)
}

export default function StartSelectionCard({ item }: CardProps) {

  const district = item.district
  const { subdomain, name } = district
  const intro = `**${name}** ${item.intro}`
  const slug = `${districtUrl(district)}${recordToSlug(item)}`

  return (
    <li className={s.card} key={item.id}>
      <Link href={slug} locale={false}>
        <figure className={s.figure}>
          {item.image &&
            <Image
              data={item.image.responsiveImage}
              pictureClassName={s.image}
              placeholderClassName={s.image}
              objectFit="cover"
            />
          }
        </figure>
      </Link>
      <Link href={slug} locale={subdomain}>
        <h3>{item.title}</h3>
      </Link>
      <Markdown className="body-small">
        {intro}
      </Markdown>
      <Link href={slug} locale={subdomain} className={cn('small', s.more)}>
        Läs mer
      </Link>
    </li>
  )
}