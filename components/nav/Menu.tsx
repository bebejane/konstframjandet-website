import s from './Menu.module.scss'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { primarySubdomain } from '/lib/utils'
import { useScrollInfo } from 'dato-nextjs-utils/hooks'
import { usePage } from '/lib/context/page'
import { sleep } from '/lib/utils'
import { SearchResult } from '/components'

import type { Menu } from '/lib/menu'
import Link from 'next/link'

const animateLogo = async () => {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	const logo = document.getElementById('logo') as HTMLAnchorElement
	for (let i = 0; i < alphabet.length; i++) {
		logo.innerText = alphabet[i]
		await sleep(20)
	}
	logo.innerText = alphabet[0]
}

export type MenuProps = {
	districts: DistrictRecord[]
	menu: Menu
}

export default function Menu({ districts, menu }: MenuProps) {

	const router = useRouter()
	const { asPath } = router
	const { district, isHome, isMainDistrict } = usePage()
	const { scrolledPosition } = useScrollInfo()
	const [offset, setOffset] = useState(0)
	const [showDistricts, setShowDistricts] = useState(false)
	const [showSearch, setShowSearch] = useState(false)
	const [query, setQuery] = useState('')
	const searchRef = useRef<HTMLInputElement | null>(null)
	const ref = useRef<HTMLElement | null>(null)

	const scrollY = Math.min(offset, scrolledPosition)
	const ratio = Math.min(1, ((scrolledPosition || 0) / offset)) || 0
	const navStyle = { transform: `translateY(-${scrollY}px)` }
	const searchStyle = { minHeight: `calc(var(--navbar-height) - ${scrollY}px)` }
	const logoStyle = { fontSize: `${((1 - ratio) * 20) + 64}px` }

	useEffect(() => {
		if (!ref.current) return
		setOffset(parseInt(getComputedStyle(ref.current).paddingTop))
	}, [ref])

	useEffect(() => {

		const handleRouteChangeStart = (path: string) => {
			setShowDistricts(false)
			animateLogo()
			setQuery('')
			setShowSearch(false)
		}
		router.events.on('routeChangeStart', handleRouteChangeStart)
		return () => router.events.off('routeChangeStart', handleRouteChangeStart)
	}, [])


	useEffect(() => {
		searchRef.current?.[showSearch ? 'focus' : 'blur']()
	}, [showSearch])

	return (
		<>
			<div className={cn(s.logo, isHome && s.home)} style={logoStyle}>
				<Link id="logo" href={'/'} locale={primarySubdomain}>A</Link>
			</div>
			<nav className={cn(s.menu, isHome && s.home)} style={navStyle} ref={ref}>
				<div className={s.top} style={{ opacity: (1 - ratio) }}>
					<h2>Konstfrämjandet{!isMainDistrict && ` ${district.name}`}</h2>
					<div className="small" >
						{isMainDistrict ?
							<>
								<a href={district.facebook}>Facebook</a>
								<a href={district.instagram}>Instagram</a>
								<Link href="/english">English</Link>
							</>
							:
							<>
								<a className="symbol" href={district.facebook}>7</a>
								<a className="symbol" href={district.instagram}>8</a>
								<Link href="/" locale={primarySubdomain}>Till Konstfrämjandet.se</Link>
							</>
						}
					</div>
				</div>
				<div className={s.wrapper} >
					<ul>
						{menu.map(({ type, slug, label }) =>
							type !== 'district' ?
								<li className={cn(((asPath.startsWith(slug) && slug !== '/') || (isHome && type == 'home')) && !showDistricts && s.active)}>
									<Link href={slug}>{label}</Link>
								</li>
								: isMainDistrict &&
								<li className={cn(showDistricts && s.active)} onClick={() => setShowDistricts(!showDistricts)}>
									Distrikt
								</li>
						)}
					</ul>
					<span className="mid" onClick={() => setShowSearch(true)}>Sök</span>
				</div>
			</nav>

			<nav className={cn(s.districts, showDistricts && s.show)} style={navStyle}>
				<h3>Besök våra distrikt</h3>
				<ul>
					{districts?.filter(({ subdomain }) => primarySubdomain !== subdomain).map(({ id, subdomain, name }) =>
						<li key={id}>
							<Link href={`/`} locale={subdomain}>{name}</Link>
						</li>
					)}
				</ul>
			</nav>

			<div className={cn(s.search, showSearch && s.show)} style={searchStyle}>
				<span className={cn(s.close, 'small')} onClick={() => setShowSearch(false)}>Stäng</span>
				<div className={s.bar} style={searchStyle}>
					<input
						className={'mid'}
						placeholder={'Sök...'}
						ref={searchRef}
						value={query}
						onChange={({ target: { value } }) => setQuery(value)}
					/>
				</div>
				<div className={s.result}>
					<SearchResult query={query} />
				</div>
			</div>

		</>
	)
}
