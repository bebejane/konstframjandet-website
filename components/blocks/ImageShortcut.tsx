import s from './ImageShortcut.module.scss'
import cn from 'classnames'
import React from 'react'
import { Image } from 'react-datocms'
import Link from 'next/link'

export type ImageShortcutBlockProps = {
  data: ImageShortcutRecord
}

export default function ImageShortcut({ data: { headline, image, link, text } }: ImageShortcutBlockProps) {

  return (
    <section className={s.container}>
      <Link href={link}>
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
      </Link>
    </section >
  )
}