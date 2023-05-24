import s from './SectionHeader.module.scss'
import cn from 'classnames'
import React from 'react'
import { usePage } from '/lib/context/page'
import useStore from '/lib/store'
import { Image } from 'react-datocms'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import ListIcon from '/public/images/list.svg'
import ThumbIcon from '/public/images/thumb.svg'
import BalanceText from 'react-balance-text'
import { is } from 'date-fns/locale'


export default function SectionHeader() {

  const { title, subtitle, image, intro, layout, color, colorOption } = usePage()
  const [view, setView] = useStore((state) => [state.view, state.setView])
  const noImage = !image?.responsiveImage

  return (
    <header className={cn(s.header, s[layout], colorOption && s[colorOption], noImage && s.noimage)}>
      <h1>
        <BalanceText><span>{title}{subtitle && ` — ${subtitle}`}</span></BalanceText>
        <div className={s.fade}></div>
      </h1>

      {!noImage &&
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
        <>
          <div className={s.introWrapper}>
            <Markdown className={cn(s.intro, "intro")}>
              {intro}
            </Markdown>
            <div className={s.fade}></div>
          </div>
        </>
      }
      {color && !noImage &&
        <div className={s.bgcolor} style={{ backgroundColor: color }}></div>
      }
      {layout === 'news' &&
        <span className={cn(s.view, 'mid')} onClick={() => setView(view === 'full' ? 'list' : 'full')}>
          {view === 'list' ? <ThumbIcon /> : <ListIcon />}
        </span>
      }
    </header >
  )
}