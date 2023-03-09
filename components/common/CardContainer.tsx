import s from './CardContainer.module.scss'
import cn from 'classnames'
import { chunkArray } from '/lib/utils'
import useDevice from '/lib/hooks/useDevice'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export type Props = {
  children?: React.ReactNode | React.ReactNode[],
  columns?: 2 | 3,
  className?: string
  whiteBorder?: boolean
}

export default function CardContainer({ children, columns = 3, className, whiteBorder = false }: Props) {

  const buildCards = () => {
    return chunkArray(Array.isArray(children) ? children : [children], !isDesktop ? 2 : columns) as [React.ReactNode[]]
  }

  const { isDesktop } = useDevice()
  const [cards, setCards] = useState(buildCards())
  const { locale } = useRouter()
  useEffect(() => {
    setCards(buildCards())
  }, [isDesktop, locale])

  return (
    <ul className={cn(s.container, columns === 2 && s.two, columns === 3 && s.three, className, whiteBorder && s.whiteBorder)}>
      {cards.map((row, idx) => {
        return (
          <React.Fragment key={idx}>
            {row.map(el => el)}
          </React.Fragment>
        )
      })}
    </ul>
  )
}