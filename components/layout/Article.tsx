import s from './Article.module.scss'
import cn from 'classnames'
import React, { useEffect } from 'react'
import { StructuredContent } from "/components";
import { Image } from 'react-datocms';
import { DatoSEO, DatoMarkdown as Markdown } from 'dato-nextjs-utils/components';
import useStore from '/lib/store';
import Link from 'next/link';

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
  record: any
  date?: string
  backLink?: string
}

export default function Article({ id, title, content, image, imageSize, intro, date, onClick, record, backLink }: ArticleProps) {

  const [setImageId, setImages, imageId] = useStore((state) => [state.setImageId, state.setImages, state.imageId])

  useEffect(() => {
    const images = [image]
    content?.blocks.forEach(el => {
      el.__typename === 'ImageRecord' && images.push.apply(images, el.image)
    })
    setImages(images.filter(el => el))
    console.log(images.filter(el => el))
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
        <section>
          <div className={s.content}>
            {intro &&
              <Markdown className={s.intro}>{intro}</Markdown>
            }
            <StructuredContent
              id={id}
              record={record}
              content={content}
              onClick={(imageId) => setImageId(imageId)}
            />
            {backLink &&
              <div className={s.back}>
                <Link href={backLink} className="mid">Visa alla</Link>
              </div>
            }
          </div>
          {image &&
            <div className={s.caption}>
              <figcaption>
                {image.title}
              </figcaption>
            </div>
          }
        </section>
      </div>
    </>
  )
}