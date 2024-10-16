import s from './Menu.module.scss'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { primarySubdomain, districtUrl } from '/lib/utils'
import { useScrollInfo } from 'dato-nextjs-utils/hooks'
import { usePage } from '/lib/context/page'
import { animateLogo } from '/lib/utils'
import { SearchResult } from '/components'
import type { Menu } from '/lib/menu'
import Link from 'next/link'
import { useOnClickOutside } from 'usehooks-ts'

export type MenuProps = {
	districts: DistrictRecord[]
	menu: Menu
}

export default function Menu({ districts, menu }: MenuProps) {

	const ref = useRef<HTMLElement | null>(null)
	const searchRef = useRef<HTMLInputElement | null>(null)
	const searchBarRef = useRef<HTMLInputElement | null>(null)
	const districtsPopupRef = useRef<HTMLDivElement | null>(null)

	const router = useRouter()
	const { asPath } = router
	const { district, isHome, isMainDistrict } = usePage()
	const { scrolledPosition } = useScrollInfo()
	const [offset, setOffset] = useState(0)
	const [districtHover, setDistrictHover] = useState<string | undefined>()
	const [showDistricts, setShowDistricts] = useState(false)
	const [showSearch, setShowSearch] = useState(false)
	const [query, setQuery] = useState('')

	const scrollY = Math.min(offset, scrolledPosition)
	const ratio = Math.min(1, ((scrolledPosition || 0) / offset)) || 0

	const navStyle = { transform: `translateY(-${scrollY}px)`, backgroundColor: scrollY > 0 ? 'var(--background)' : undefined }
	const searchStyle = { minHeight: `calc(var(--navbar-height) - ${scrollY}px)` }
	const resultsStyle = { minHeight: `calc(100vh - var(--navbar-height) + ${scrollY}px)`, maxHeight: `calc(100vh - var(--navbar-height) + ${scrollY}px)` }
	const logoStyle = { fontSize: `calc(${Math.max(0.8, (1 - ratio))} * var(--navbar-height) + calc(-1 * var(--navbar-space))` }

	useOnClickOutside(districtsPopupRef, () => setTimeout(() => showDistricts && setShowDistricts(false), 10))
	useOnClickOutside(searchBarRef, () => setShowSearch(false))

	const handleSearchSubmit = (e) => {
		e.preventDefault()
		setQuery(searchRef.current.value);
	}

	const resetSearch = () => {
		setQuery('')
		setShowSearch(false)
	}

	useEffect(() => {
		if (!ref.current) return
		setOffset(parseInt(getComputedStyle(ref.current).paddingTop))
	}, [ref])

	useEffect(() => {

		const handleRouteChangeStart = (path: string) => {
			setShowDistricts(false)
			animateLogo('logo')
			resetSearch()
		}
		router.events.on('routeChangeStart', handleRouteChangeStart)
		return () => router.events.off('routeChangeStart', handleRouteChangeStart)
	}, [])

	useEffect(() => {
		searchRef.current[showSearch ? 'focus' : 'blur']();
		searchRef.current.value = ''
		setQuery('')

	}, [searchRef, showSearch])


	return (
		<>
			<div className={cn(s.logo, isHome && s.home)} >
				<Link id="logo" href={'/'} style={logoStyle}>A</Link>
			</div>
			<nav className={cn(s.menu, isHome && s.home)} style={navStyle} ref={ref}>
				<div className={s.top} style={{ opacity: (1 - ratio) }}>
					<h2>Konstfrämjandet{!isMainDistrict && ` ${district.name}`}</h2>
					<div className="small" >
						{isMainDistrict ?
							<>
								<a href={district.facebook}>Facebook</a>
								<a href={district.instagram}>Instagram</a>
								<Link href="/om/english">English</Link>
							</>
							:
							<>
								<a className="symbol" href={district.facebook}>7</a>
								<a className="symbol" href={district.instagram}>8</a>
								{console.log('district.englishShortcut:', district.englishShortcut)}

								{district.englishShortcut && (
									<Link href="/om/english" locale={primarySubdomain}>
										English
									</Link>
								)}
								<Link href={process.env.NODE_ENV === 'production' ? 'https://www.konstframjandet.se' : '/'} locale={primarySubdomain}>Till Konstfrämjandet.se</Link>
							</>
						}
					</div>
				</div>
				<div className={s.wrapper} >
					<ul>
						{menu.map(({ type, slug, label }, idx) =>
							type !== 'district' ?
								<li key={idx} className={cn(((asPath.startsWith(`/${slug.split('/')[1]}`) && slug !== '/') || (isHome && type == 'home')) && !showDistricts && s.active)}>
									{slug ? <Link href={slug}>{label}</Link> : <>{label}</>}
								</li>
								: isMainDistrict &&
								<li key={idx} className={cn(showDistricts && s.active)} onClick={() => setShowDistricts(!showDistricts)}>
									Distrikt
								</li>
						)}
					</ul>
					<span className={"mid"} onClick={() => setShowSearch(true)}>Sök</span>
				</div>
			</nav>

			<nav
				ref={districtsPopupRef}
				className={cn(s.districts, showDistricts && s.show)}
				style={{ ...navStyle, backgroundColor: 'var(--white)' }}
			>
				<span className="mid">Besök våra distrikt</span>
				<ul>
					{districts?.filter(d => primarySubdomain !== d.subdomain).map(d =>
						<li key={d.id}>
							<Link
								href={districtUrl(d)}
								locale={d.subdomain}
								onMouseEnter={() => setDistrictHover(d.id)}
								onMouseLeave={() => setDistrictHover(undefined)}
								style={{ color: districtHover === d.id ? d.color.hex : 'unset' }}
							>{d.name}</Link>
						</li>
					)}
				</ul>
			</nav>

			<div ref={searchBarRef} className={cn(s.search, showSearch && s.show)} style={searchStyle}>
				<div className={s.bar} style={searchStyle}>
					<form onSubmit={handleSearchSubmit}>
						<input
							className={'mid'}
							placeholder={'Sök...'}
							ref={searchRef}
						/>
					</form>
				</div>
				<div className={s.results} style={query ? resultsStyle : {}}>
					<SearchResult query={query} district={district} />
				</div>
				<span className={cn(s.close, 'small')} onClick={resetSearch}>Stäng</span>
			</div>
		</>
	)
}
