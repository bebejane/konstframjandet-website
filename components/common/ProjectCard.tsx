import s from './ProjectCard.module.scss'
import cn from 'classnames'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import format from 'date-fns/format'
import { Image } from 'react-datocms/image'
import Link from 'next/link'

export type CardProps = {
  news: ProjectRecord
}

export default function ProjectCard({ news: { title, intro, image, slug } }: CardProps) {
  return (
    <li className={cn(s.card)}>
      <figure className={s.figure}>
        <Image data={image.responsiveImage} className={s.image} />
        <div className={s.content}>
          <h1>{title}</h1>
          <Markdown>
            {intro}
          </Markdown>
        </div>
      </figure>
    </li>
  )
}