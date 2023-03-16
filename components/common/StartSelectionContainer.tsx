import s from './StartSelectionContainer.module.scss'
import cn from 'classnames'
import React from 'react'

export type Props = {
  children?: React.ReactNode | React.ReactNode[]
}

export default function StartSelectionContainer({ children }: Props) {

  return (
    <section className={s.container}>
      <h2 className="mid">Aktuellt i övriga distrikt</h2>
      <ul className={cn(s.container)}>
        {children}
      </ul>
    </section>
  )
}