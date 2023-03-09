import s from './Article.module.scss'
import cn from 'classnames'
import React, { useEffect, useRef } from 'react'
import { MetaSection, StructuredContent } from "/components";
import { Image } from 'react-datocms';
import { useScrollInfo } from 'dato-nextjs-utils/hooks'
import { DatoSEO } from 'dato-nextjs-utils/components';
import useStore from '/lib/store';
import format from 'date-fns/format';

export type ArticleProps = {
  id: string
  children?: React.ReactNode | React.ReactNode[] | undefined
  title?: string
  subtitle?: string
  intro?: string
  image?: FileField
  imageSize?: 'small' | 'medium' | 'large'
  content?: any
  onClick?: (id: string) => void
  record?: any
  date?: string
}

const MAX_PORTRAIT_HEIGHT = 600;

export default function Article({ id, children, title, content, image, imageSize, intro, date, onClick, record }: ArticleProps) {

  const [setImageId, setImages, imageId] = useStore((state) => [state.setImageId, state.setImages, state.imageId])
  const { scrolledPosition, viewportHeight } = useScrollInfo()

  useEffect(() => {
    const images = [image]
    content?.blocks.forEach(el => {
      el.__typename === 'ImageRecord' && images.push(el.image)
      el.__typename === 'ImageGalleryRecord' && images.push.apply(images, el.images)
    })
    setImages(images.filter(el => el))
  }, [])

  return (
    <>
      <DatoSEO title={title} />
      <div className={cn(s.article, 'article')}>
        {image &&
          <figure
            className={cn(s.mainImage, imageSize && s[imageSize], image.height > image.width && s.portrait)}
            onClick={() => setImageId(image?.id)}
          >
            <Image
              data={image.responsiveImage}
              pictureClassName={s.picture}
            />
          </figure>
        }
        <section className="intro">
          {date &&
            <div className={s.date}>
              <span className="small">{format(new Date(date), 'MMM').replace('.', '')}</span>
              <span>{format(new Date(date), 'dd').replace('.', '')}</span>
            </div>
          }
          {intro}
        </section>
        {content &&
          <StructuredContent
            id={id}
            record={record}
            content={content}
            onClick={(imageId) => setImageId(imageId)}
          />
        }
        {children}
      </div>
    </>
  )
}