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

export type MenuProps = { items: Menu }

export default function Menu({ items }: MenuProps) {

	const router = useRouter()
	const menuRef = useRef<HTMLUListElement | null>(null);
	const [showMenu, setShowMenu, searchQuery, setSearchQuery] = useStore((state) => [state.showMenu, state.setShowMenu, state.searchQuery, state.setSearchQuery])
	const [selected, setSelected] = useState<MenuItem | undefined>()
	const { scrolledPosition, documentHeight, viewportHeight } = useScrollInfo()
	const { width, height } = useWindowSize()
	const { isDesktop } = useDevice()


	return (
		<>

			<nav
				className={cn(s.menu, !showMenu && s.hide)}
			>
				Menu
			</nav>
		</>
	)
}
