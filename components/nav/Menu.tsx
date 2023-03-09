import s from './Menu.module.scss'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import type { Menu, MenuItem } from '/lib/menu'
import Link from 'next/link'
import useStore from '/lib/store'
import { useScrollInfo } from 'dato-nextjs-utils/hooks'
import { useWindowSize } from 'usehooks-ts'
import useDevice from '/lib/hooks/useDevice'
import { usePage } from '/lib/context/page'

export type MenuProps = { items: Menu }

export default function Menu({ items }: MenuProps) {

	const { district } = usePage()

	return (
		<>
			<nav className={cn(s.menu)}>
				<h2>{district.name}</h2>
				<div className={s.wrapper}>
					<ul>
						<li><Link href="/nyheter">Hem</Link></li>
						<li><Link href="/nyheter">Nyheter</Link></li>
						<li><Link href="/projekt">Projekt</Link></li>
						<li><Link href="/om">Om oss</Link></li>
						<li><Link href="/kontakt">Kontakt</Link></li>
					</ul>
					<span className="mid">Sök</span>
				</div>
			</nav>
		</>
	)
}
