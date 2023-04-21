import s from './StartLatestNews.module.scss'
import cn from 'classnames'
import React from 'react'
import { NewsContainer, NewsCard } from '/components'
import Link from 'next/link'

export type Props = {
  count: number
  data: {
    news: NewsRecord[]
    count: number
  }
}

export default function StartLatestNews({ data: { news, count } }: Props) {

  return (
    <section className={s.container}>
      <header className="mid">
        <h2>Aktuellt</h2>
        <Link href={'/aktuellt'} className="mid">Visa alla</Link>
      </header>
      <NewsContainer>
        {news.slice(0, count).map(item =>
          <NewsCard key={item.id} news={item} />
        )}
      </NewsContainer>
    </section >
  )
}