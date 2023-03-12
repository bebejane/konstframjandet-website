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

export default function ProjectCard({ project: { id, title, intro, image, slug } }: CardProps) {

  return (
    <li className={cn(s.card)} key={id}>
      <Link href={`/projekt/${slug}`}>
        <figure>
          <h1>{title}</h1>
          <div className={s.text}>
            <Image data={image.responsiveImage} className={s.image} objectFit="cover" />
            <Markdown className={cn(s.intro)}>
              {intro}
            </Markdown>
          </div>
        </figure>
      </Link>
    </li >
  )
}