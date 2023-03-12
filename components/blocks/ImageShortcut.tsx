import s from './ImageShortcut.module.scss'
import cn from 'classnames'
import React from 'react'
import { Image } from 'react-datocms'
import Link from 'next/link'
import { recordToSlug } from '/lib/utils'

export type ImageShortcutBlockProps = {
  data: ImageShortcutRecord
}

export default function ImageShortcut({ data: { headline, image, link, externalLink, text } }: ImageShortcutBlockProps) {

  const href = link ? recordToSlug(link) : externalLink

  return (
    <section className={s.container}>
      <Link href={href}>
        <figure>
          {image &&
            <Image
              className={s.image}
              data={image.responsiveImage}
              objectFit={'cover'}
            />
          }
          <figcaption>
            <h1>
              {headline}
            </h1>
            <p>{text}</p>
          </figcaption>
        </figure>
        <div className={cn(s.bubble, 'mid')}>Visa</div>
      </Link>
    </section >
  )
}