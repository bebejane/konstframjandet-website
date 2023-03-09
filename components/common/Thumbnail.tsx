import s from './Thumbnail.module.scss'
import cn from 'classnames'
import React, { useState } from 'react'
import { Image } from 'react-datocms/image'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { usePage } from '/lib/context/page'
import { randomInt } from '/lib/utils'

export type Props = {
  image?: FileField
  slug: string
  title: string
  intro?: string
  meta?: string
}

export default function Thumbnail({ image, slug, intro, title, meta }: Props) {

  const content = intro ? `${meta ? `**${meta}** ` : ''}${intro}` : undefined
  const { query: { year } } = useRouter()
  const { year: { loadingImage }, isArchive } = usePage()
  const [loadingImageIndex] = useState(randomInt(0, loadingImage.length - 1))
  const [loaded, setLoaded] = useState(false);
  const href = year ? `/${year}${slug}` : slug;

  return (
    <Link
      className={s.thumbnail}
      href={href}
    >
      <h3>{title}</h3>
      {image &&
        <div className={s.imageWrap}>
          <Image
            data={image.responsiveImage}
            className={s.image}
            pictureClassName={s.picture}
            style={{ opacity: loaded ? 1 : 0.000001 }}
            onLoad={() => setTimeout(() => setLoaded(true), randomInt(200, 400))}
          />
          {!isArchive &&
            <Image
              data={loadingImage[loadingImageIndex].responsiveImage}
              className={cn(s.loader)}
              pictureClassName={cn(s.picture, s.loader, loaded && s.hide)}
              lazyLoad={false}
              objectFit={'contain'}
            />
          }
        </div>
      }
      {content &&
        <Markdown className="thumb-intro" truncate={200}>
          {content}
        </Markdown>
      }
    </Link>
  )
}