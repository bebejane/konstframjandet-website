import s from './Article.module.scss'
import cn from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { StructuredContent } from "/components";
import { Image } from 'react-datocms';
import { DatoSEO, DatoMarkdown as Markdown } from 'dato-nextjs-utils/components';
import { useScrollInfo } from 'dato-nextjs-utils/hooks';
import strip from 'strip-markdown'
import { remark } from 'remark'

import useStore from '/lib/store';
import Link from 'next/link';

export type ArticleProps = {
  id: string
  children?: React.ReactNode | React.ReactNode[] | undefined
  title?: string
  subtitle?: string
  intro?: string
  image?: ImageFileField
  imageSize?: 'small' | 'medium' | 'large'
  content?: any
  extraContent?: any
  onClick?: (id: string) => void
  record: any
  dropcap?: boolean
  date?: string
  backLink?: string
  aside?: React.ReactNode | React.ReactNode[] | undefined
  seo?: Tag[]
}

export default function Article({ id, title, content, extraContent, image, imageSize, intro, backLink, record = {}, dropcap = false, seo }: ArticleProps) {

  const [setImageId, setImages, imageId] = useStore((state) => [state.setImageId, state.setImages, state.imageId])
  const description = intro ? remark().use(strip).processSync(intro).value as string : null

  useEffect(() => {
    const images = [image]
    content?.blocks.forEach(el => {
      el.__typename === 'ImageRecord' && images.push(el.image)
      el.__typename === 'ImageGalleryRecord' && images.push.apply(images, el.images)
    })
    console.log(images)
    setImages(images.filter(el => el))
  }, [])

  return (
    <>
      <DatoSEO seo={seo} title={title} description={description} />
      <div className={cn(s.article, 'article')}>
        {image?.responsiveImage &&
          <>
            <figure
              className={cn(s.mainImage, imageSize && s[imageSize])}
              onClick={() => setImageId(image?.id)}
            >
              <Image
                data={image.responsiveImage}
                className={s.image}
                pictureClassName={s.picture}
              />
              <figcaption>
                {image.title}
              </figcaption>
            </figure>
          </>
        }
        <section>
          <div className={s.content}>
            {intro &&
              <Markdown className={cn(s.intro, "intro")}>{intro}</Markdown>
            }
            <div className={cn(s.structured, (record.dropcap || dropcap) && s.dropcap, !backLink && s.nobackLink)}>
              <StructuredContent
                id={id}
                record={record}
                content={content}
                onClick={(imageId) => setImageId(imageId)}
              />
              {extraContent &&
                <div className={cn(s.extraContent, "body-small")}>
                  <StructuredContent
                    id={id}
                    record={record}
                    content={extraContent}
                  />
                </div>
              }
              {backLink && <BackLink href={backLink} />}
            </div>
          </div>
        </section >
      </div >
    </>
  )
}

const BackLink = ({ href }) => {

  const ref = useRef<HTMLDivElement | null>(null)
  const [hide, setHide] = useState(false)
  const { scrolledPosition } = useScrollInfo()

  useEffect(() => {
    const aside = document.getElementsByTagName('aside')[0]
    if (aside === undefined) return
    const { bottom } = aside.getBoundingClientRect()
    const hide = ref.current.getBoundingClientRect().top <= bottom + 30
    setHide(hide)

  }, [scrolledPosition])

  return (
    <div ref={ref} className={cn(s.back, hide && s.hide)}>
      <Link href={href} className="mid">Visa alla</Link>
    </div>
  )
}