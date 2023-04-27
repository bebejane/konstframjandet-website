import s from './Article.module.scss'
import cn from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { StructuredContent } from "/components";
import { Image } from 'react-datocms';
import { DatoSEO, DatoMarkdown as Markdown } from 'dato-nextjs-utils/components';
import { useScrollInfo } from 'dato-nextjs-utils/hooks';
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
  dropcap?: boolean
  date?: string
  backLink?: string
  aside?: React.ReactNode | React.ReactNode[] | undefined
}

export default function Article({ id, title, content, image, imageSize, intro, backLink, aside, record = {}, dropcap = false }: ArticleProps) {

  const [setImageId, setImages, imageId] = useStore((state) => [state.setImageId, state.setImages, state.imageId])

  useEffect(() => {
    const images = [image]
    content?.blocks.forEach(el => {
      el.__typename === 'ImageRecord' && images.push(el.image)
    })
    console.log(images)
    setImages(images.filter(el => el))
  }, [])

  return (
    <>
      <DatoSEO title={title} />
      <div className={cn(s.article, 'article')}>
        {image?.responsiveImage &&
          <>
            <figure
              className={cn(s.mainImage, imageSize && s[imageSize], image.height > image.width && s.portrait)}
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
            <div className={cn(s.structured, (record.dropcap || dropcap) && s.dropcap)}>
              <StructuredContent
                id={id}
                record={record}
                content={content}
                onClick={(imageId) => setImageId(imageId)}
              />
              {backLink && <BackLink href={backLink} />}
            </div>
          </div>
        </section>
      </div>
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