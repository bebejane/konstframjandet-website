import s from './ImageShortcut.module.scss'
import cn from 'classnames'
import React from 'react'
import { Image } from 'react-datocms'
import Link from 'next/link'
import { Bubble } from '/components'
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
            <header>
              <h1>{headline}</h1>
              <div className={s.fade}></div>
            </header>
            <div className={s.intro}>
              <p className="intro">{text}</p>
              <div className={s.fade}></div>
            </div>
          </figcaption>
        </figure>
        <Bubble className={cn(s.bubble, 'mid')}>Visa</Bubble>

      </Link>
    </section >
  )
}