import s from './SectionHeader.module.scss'
import cn from 'classnames'
import React, { useState, useEffect } from 'react'
import { usePage } from '/lib/context/page'
import useStore from '/lib/store'
import { Image } from 'react-datocms'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'
import BalanceText from 'react-balance-text'

export default function SectionHeader() {

  const { title, subtitle, image, intro, layout, color, colorOption } = usePage()
  console.log(colorOption, s[colorOption])

  return (
    <header className={cn(s.header, s[layout], colorOption && s[colorOption])}>
      <h1><BalanceText><span>{title}{subtitle && ` — ${subtitle}`}</span></BalanceText></h1>

      {image &&
        <>
          <div className={s.direct}>
            <img src="http://localhost:3000/images/mask4.svg"></img>
            <span className="mid">Besök<br /> projektets<br />hemsida</span></div>
          <figure>
            <Image
              data={image.responsiveImage}
              className={s.image}
              pictureClassName={s.image}
              objectFit="cover"
            />
          </figure>
        </>
      }
      {intro &&
        <Markdown className={cn(s.intro, "intro")}>
          {intro}
        </Markdown>
      }
      {color &&
        <div className={s.bgcolor} style={{ backgroundColor: color }}></div>
      }
    </header>
  )
}