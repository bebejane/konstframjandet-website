import s from './Content.module.scss'
import cn from 'classnames'
import React from 'react'
import { Loader, SectionHeader } from '/components'
import { Menu } from '/lib/menu'
import useStore from '/lib/store'
import { usePage } from '/lib/context/page'
import { useRouter } from 'next/router'

export type ContentProps = {
	children: React.ReactNode,
	title: string
	menu: Menu
	image?: FileField
	intro?: string
}

export default function Content({ children, title }: ContentProps) {

	const { asPath } = useRouter()
	const { layout, isHome } = usePage()

	return (
		<>
			<main id="content" className={cn(s.content, s[layout])}>
				{!isHome && title &&
					<SectionHeader key={asPath} />
				}
				<article>
					{children}
				</article>

			</main>
		</>
	)
}