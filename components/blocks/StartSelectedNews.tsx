import s from './StartSelectedNews.module.scss'
import cn from 'classnames'
import React from 'react'
import { NewsContainer, NewsCard } from '/components'

export type Props = {
  data: StartSelectedNewsRecord
}

export default function StartSelectedNews({ data: { news } }: Props) {

  return (
    <section className={s.container}>
      <NewsContainer>
        {news.map(item =>
          <NewsCard key={item.id} news={item} />
        )}
      </NewsContainer>
    </section >
  )
}