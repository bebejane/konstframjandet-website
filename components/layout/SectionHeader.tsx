import s from './SectionHeader.module.scss'
import cn from 'classnames'
import React, { useState, useEffect } from 'react'
import { usePage } from '/lib/context/page'
import useStore from '/lib/store'

export type SectionHeaderProps = {
  title: string
  image?: FileField
  intro?: string
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <header className={cn(s.header)}>
      <h1>{title}</h1>
    </header>
  )
}