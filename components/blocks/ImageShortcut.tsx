import s from './ImageShortcut.module.scss'
import cn from 'classnames'
import React from 'react'
import { Image } from 'react-datocms'
import Link from 'next/link'
import { Bubble, DatoLink } from '/components'

export type ImageShortcutBlockProps = {
  data: ImageShortcutRecord
}

export default function ImageShortcut({ data: { headline, image, link, text } }: ImageShortcutBlockProps) {

  return (
    <section className={s.container}>
      <DatoLink link={link}>
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
      </DatoLink>
    </section >
  )
}