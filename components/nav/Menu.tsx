import s from './Menu.module.scss'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import type { Menu, MenuItem } from '/lib/menu'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Hamburger, Temperature } from '/components'
import useStore from '/lib/store'
import { useScrollInfo } from 'dato-nextjs-utils/hooks'
import { useWindowSize } from 'usehooks-ts'
import useDevice from '/lib/hooks/useDevice'

export type MenuProps = { items: Menu }

export default function Menu({ items }: MenuProps) {

	const t = useTranslations('Menu')
	const router = useRouter()
	const menuRef = useRef<HTMLUListElement | null>(null);
	const [showMenu, setShowMenu, searchQuery, setSearchQuery] = useStore((state) => [state.showMenu, state.setShowMenu, state.searchQuery, state.setSearchQuery])
	const [selected, setSelected] = useState<MenuItem | undefined>()
	const [searchFocus, setSearchFocus] = useState(false)
	const [path, setPath] = useState(router.asPath)
	const [menuPadding, setMenuPadding] = useState(0)
	const [footerScrollPosition, setFooterScrollPosition] = useState(0)
	const { scrolledPosition, documentHeight, viewportHeight } = useScrollInfo()
	const { width, height } = useWindowSize()
	const { isDesktop } = useDevice()

	useEffect(() => {
		const handleRouteChangeStart = (path: string) => {
			setPath(path)
			!isDesktop && setShowMenu(false)
		}
		router.events.on('routeChangeStart', handleRouteChangeStart)
		return () => router.events.off('routeChangeStart', handleRouteChangeStart)
	}, [isDesktop])

	useEffect(() => {

		const footerHeight = document.getElementById('footer').clientHeight - 1
		const menuOffset = menuRef.current.offsetTop
		const footerScrollPosition = (scrolledPosition + viewportHeight) < documentHeight - footerHeight ? 0 : footerHeight - (documentHeight - (scrolledPosition + viewportHeight))
		setMenuPadding(footerScrollPosition ? menuOffset + footerScrollPosition : 0)
		setFooterScrollPosition(footerScrollPosition)

	}, [menuRef, selected, scrolledPosition, documentHeight, viewportHeight, width, height])

	return (
		<>
			<Hamburger />
			<nav
				className={cn(s.menu, !showMenu && s.hide)}
				style={{ minHeight: `calc(100vh - ${footerScrollPosition}px - 1px)` }}
			>
				<Temperature />
				<ul
					data-level={0}
					ref={menuRef}
					style={{ maxHeight: `calc(100vh - ${menuPadding}px - 1rem)` }}
				>
					{items.map((item, idx) =>
						<MenuTree
							key={idx}
							item={item}
							level={0}
							selected={selected}
							setSelected={setSelected}
							path={path}
							locale={router.locale}
						/>
					)}
					<li className={s.search}>
						<input
							placeholder={t('search')}
							value={searchQuery || ''}
							onFocus={() => setSearchFocus(true)}
							onBlur={() => setSearchFocus(false)}
							onChange={({ target: { value } }) => setSearchQuery(value)}
						/>
						<div
							onClick={() => setSearchQuery(undefined)}
							className={cn(s.close, !searchFocus && s.hide)}
						>×</div>
					</li>
				</ul>
			</nav>
		</>
	)
}

export type MenuTreeProps = {
	item: MenuItem
	level?: number,
	selected: MenuItem | undefined
	setSelected: (item: MenuItem) => void
	path: string
	locale: string
}

export function MenuTree({ item, level, selected, setSelected, path, locale }: MenuTreeProps) {

	const t = useTranslations('Menu')
	const [isVisible, setIsVisible] = useState(false);
	const isSelected = path === item.slug || path === `/${locale}${item.slug}`
	const isLink = item.slug && !item.sub
	const label = t(item.id) || item.label

	const expand = () => {
		setIsVisible(!isVisible)
		setSelected(item)
		const nodes = Array.from(document.querySelectorAll(`ul[data-level="${level + 1}"]`)) as HTMLUListElement[]
		nodes.forEach(el => (el.parentNode as HTMLLIElement).click())
	}

	return (
		<li onClick={expand} data-parent={item.id} className={cn(isSelected && s.active, level === 0 && s.bold)}>
			{isLink ? <Link href={item.slug}>{label}</Link> : <>{label}</>}
			{item?.sub && isVisible &&
				<ul data-level={++level} onClick={e => e.stopPropagation()}>
					{item.sub.map((item, idx) =>
						<MenuTree
							key={idx}
							item={item}
							level={level}
							selected={selected}
							setSelected={setSelected}
							path={path}
							locale={locale}
						/>
					)}
				</ul>
			}
		</li>
	);
}
