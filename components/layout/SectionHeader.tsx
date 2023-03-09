import s from './SectionHeader.module.scss'
import cn from 'classnames'
import React, { useState, useEffect } from 'react'
import { usePage } from '/lib/context/page'
import useStore from '/lib/store'
import { Image } from 'react-datocms'
import { DatoMarkdown, DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'

export type SectionHeaderProps = {
  title: string
  image?: FileField
  intro?: string
}

export default function SectionHeader({ }: SectionHeaderProps) {

  const { title, image, intro, layout } = usePage()

  return (
    <header className={cn(s.header, s[layout])}>
      <h1>{title}</h1>
      {image &&
        <figure>
          <Image
            data={image.responsiveImage}
            className={s.image}
            pictureClassName={s.image}
            objectFit="cover"
          />

        </figure>
      }
      {intro &&

        <Markdown className={s.intro}>
          {intro}
        </Markdown>

      }
    </header>
  )
}