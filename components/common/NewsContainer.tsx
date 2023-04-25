import s from './NewsContainer.module.scss'
import cn from 'classnames'
import React, { useEffect, useState } from 'react'

export type Props = {
  children?: React.ReactNode | React.ReactNode[],
  className?: string
  view?: 'list' | 'full'
}

export default function NewsContainer({ children, className, view = 'full' }: Props) {

  return (
    <ul className={cn(s.container, className, view === 'list' && s.list)}>
      {children}
    </ul>
  )
}