'use client'

import s from './Content.module.scss'
import cn from 'classnames'
import React from 'react'
import {  SectionHeader } from '@/components'
import { Menu } from '@/lib/menu'
import { usePage } from '@/lib/context/page'
import { usePathname } from 'next/navigation'

export type ContentProps = {
	children: React.ReactNode,
	title: string
	menu: Menu
	image?: FileField
	intro?: string
}

export default function Content({ children, title }: ContentProps) {

	const pathname = usePathname()
	const { layout, isHome } = usePage()

	return (
		<>
			<main id="content" className={cn(s.content, s[layout])}>
				{!isHome && title &&
					<SectionHeader key={pathname} />
				}
				<article>
					{children}
				</article>
			</main>
		</>
	)
}