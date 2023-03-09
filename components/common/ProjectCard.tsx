import s from './ProjectCard.module.scss'
import cn from 'classnames'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import format from 'date-fns/format'
import { Image } from 'react-datocms/image'
import Link from 'next/link'

export type CardProps = {
  project: ProjectRecord
}

export default function ProjectCard({ project: { title, intro, image, slug } }: CardProps) {
  return (
    <li className={cn(s.card)}>
      <Link href={`/projekt/${slug}`}>
        <figure>
          <h1>{title}</h1>
          <Image data={image.responsiveImage} className={s.image} objectFit="cover" />
          <figcaption className={s.content}>
            <Markdown className={s.intro}>
              {intro}
            </Markdown>
          </figcaption>
        </figure>
      </Link>
    </li>
  )
}