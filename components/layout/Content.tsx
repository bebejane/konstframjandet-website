import s from './Content.module.scss'
import cn from 'classnames'
import React from 'react'
import { SectionHeader } from '/components'
import { Menu } from '/lib/menu'
import useStore from '/lib/store'

export type ContentProps = {
	children: React.ReactNode,
	title: string
	menu: Menu
}

export default function Content({ children, title, menu }: ContentProps) {

	return (
		<main id="content" className={cn(s.content)}>
			<SectionHeader title={title} />
			<article>
				{children}
			</article>
		</main>
	)
}