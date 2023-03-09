import s from './ProjectContainer.module.scss'
import cn from 'classnames'
import React, { useEffect, useState } from 'react'

export type Props = {
  children?: React.ReactNode | React.ReactNode[],
  className?: string
}

export default function ProjectContainer({ children, className }: Props) {

  return (
    <ul className={cn(s.container)}>
      {children}
    </ul>
  )
}