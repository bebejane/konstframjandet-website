import s from './Content.module.scss'
import cn from 'classnames'
import React from 'react'
import { Loader, SectionHeader } from '/components'
import { Menu } from '/lib/menu'
import useStore from '/lib/store'
import { usePage } from '/lib/context/page'

export type ContentProps = {
	children: React.ReactNode,
	title: string
	menu: Menu
	image?: FileField
	intro?: string
}

export default function Content({ children, title, image, intro, menu }: ContentProps) {

	const { layout, isHome } = usePage()

	return (
		<>
			<main id="content" className={cn(s.content, s[layout])}>
				{!isHome && title &&
					<SectionHeader title={title} />
				}
				<article>
					{children}
				</article>

			</main>
		</>
	)
}