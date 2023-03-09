import s from './Card.module.scss'
import cn from 'classnames'
import React from 'react'

export type CardProps = {
  children: React.ReactNode | React.ReactNode[],
  className?: string
}

export default function Card({ children, className }: CardProps) {

  return (
    <li className={cn(s.card, className)}>
      {children}
    </li>
  )
}