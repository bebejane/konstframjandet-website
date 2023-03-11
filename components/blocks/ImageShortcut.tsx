import s from './ImageShortcut.module.scss'
import cn from 'classnames'
import React from 'react'
import { Image } from 'react-datocms'
import { ReadMore } from '/components'

export type ImageShortcutBlockProps = {
  data: ImageShortcutRecord
}

export default function ImageShortcut({ data: { headline, image, link, text } }: ImageShortcutBlockProps) {

  return (
    <section className={s.container}>
      <figure>
        {image &&
          <Image
            className={s.image}
            data={image.responsiveImage}
            objectFit={'cover'}
          />
        }
        <figcaption>
          <h2>
            {headline}
          </h2>
          <p>{text}</p>
        </figcaption>
      </figure>
    </section >
  )
}