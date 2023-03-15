import s from './Menu.module.scss'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { primarySubdomain } from '/lib/utils'
import { useScrollInfo } from 'dato-nextjs-utils/hooks'
import { usePage } from '/lib/context/page'
import { sleep } from '/lib/utils'
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

export type MenuProps = { districts: DistrictRecord[] }

export default function Menu({ districts }: MenuProps) {

	const router = useRouter()
	const { asPath } = router
	const { district, isHome, isMainDistrict } = usePage()
	const { scrolledPosition } = useScrollInfo()
	const [offset, setOffset] = useState(0)
	const [showDistricts, setShowDistricts] = useState(false)
	const [showSearch, setShowSearch] = useState(false)
	const searchRef = useRef<HTMLInputElement | null>(null)
	const ref = useRef<HTMLElement | null>(null)

	const scrollY = Math.min(offset, scrolledPosition)
	const ratio = Math.min(1, ((scrolledPosition || 0) / offset)) || 0
	const navStyle = { transform: `translateY(-${scrollY}px)` }
	const searchStyle = { height: `calc(var(--navbar-height) - ${scrollY}px)` }
	const logoStyle = { fontSize: `${((1 - ratio) * 20) + 64}px` }

	useEffect(() => {
		if (!ref.current) return
		setOffset(parseInt(getComputedStyle(ref.current).paddingTop))
	}, [ref])

	useEffect(() => {
		const handleRouteChangeStart = (path: string) => {
			setShowDistricts(false)
			animateLogo()
		}
		router.events.on('routeChangeStart', handleRouteChangeStart)
		return () => router.events.off('routeChangeStart', handleRouteChangeStart)
	}, [])

	useEffect(() => {
		//searchRef.current[showSearch ? 'focus' : 'blur']?.()
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
						<a href={district.facebook}>Facebook</a>
						<a href={district.instagram}>Instagram</a>
						<Link href="/english">English</Link>
					</div>
				</div>
				<div className={s.wrapper} >
					<ul>
						<li className={cn(isHome && !showDistricts && s.active)}>
							<Link href="/">Hem</Link>
						</li>
						<li className={cn(asPath.startsWith('/aktuellt') && !showDistricts && s.active)}>
							<Link href="/aktuellt">Aktuellt</Link>
						</li>
						<li className={cn(asPath.startsWith('/projekt') && !showDistricts && s.active)}>
							<Link href="/projekt">Projekt</Link>
						</li>
						<li className={cn(showDistricts && s.active)} onClick={() => setShowDistricts(!showDistricts)}>
							Distrikt
						</li>
						<li className={cn(asPath.startsWith('/om') && !showDistricts && s.active)}>
							<Link href="/om">Om oss</Link>
						</li>
						<li className={cn(asPath.startsWith('/kontakt') && !showDistricts && s.active)}>
							<Link href="/kontakt">Kontakt</Link>
						</li>
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
				<input className={'mid'} placeholder={'Sök...'} ref={searchRef} />
				<span className={cn(s.close, 'small')} onClick={() => setShowSearch(false)}>Stäng</span>
			</div>

		</>
	)
}
