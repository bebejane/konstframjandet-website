import s from './ProjectCard.module.scss'
import cn from 'classnames'
import React from 'react'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import format from 'date-fns/format'
import { Image } from 'react-datocms/image'
import Link from 'next/link'

export type CardProps = {
  project: ProjectRecord
  index: number
  total: number
}

export default function ProjectCard({ project: { id, title, intro, image, slug, color }, project, index, total }: CardProps) {

  return (
    <>
      <li className={s.card} key={id}>
        <Link href={`/projekt/${slug}`}>
          <figure>
            <div className={s.text}>
              {image &&
                <Image
                  data={image.responsiveImage}
                  className={s.image}
                  objectFit="cover"
                />
              }
              {color?.hex &&
                <div className={s.bgcolor} style={{ backgroundColor: color.hex }}></div>
              }
              <h1>{title}</h1>

              <Markdown className={cn(s.intro)}>
                {intro}
              </Markdown>
            </div>

          </figure>
        </Link>

      </li>
      {index % 2 === 1 && <hr className={cn(s.divider, total % 2 === 0 && s.odd)} />}
    </>
  )
}