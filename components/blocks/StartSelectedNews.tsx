import s from './StartSelectedNews.module.scss'
import cn from 'classnames'
import React from 'react'
import { NewsContainer, NewsCard } from '/components'
import Link from 'next/link'

export type Props = {
  data: StartSelectedNewsRecord
}

export default function StartSelectedNews({ data: { news } }: Props) {

  return (
    <section className={s.container}>
      <header className="mid">
        <h2 className="mid">Aktuellt</h2>
        <Link href={'/aktuellt'} className="mid">Visa alla</Link>
      </header>
      <NewsContainer>
        {news.map(item =>
          <NewsCard key={item.id} news={item} />
        )}
      </NewsContainer>
    </section >
  )
}