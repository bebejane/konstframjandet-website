import s from './Menu.module.scss'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { primarySubdomain } from '/lib/utils'
import useStore from '/lib/store'
import { useScrollInfo } from 'dato-nextjs-utils/hooks'
import { useWindowSize } from 'usehooks-ts'
import useDevice from '/lib/hooks/useDevice'
import { usePage } from '/lib/context/page'

export type MenuProps = { districts: DistrictRecord[] }

export default function Menu({ districts }: MenuProps) {

	const router = useRouter()
	const { asPath } = router
	const { district, isHome } = usePage()
	const { scrolledPosition } = useScrollInfo()
	const [offset, setOffset] = useState(0)
	const [showDistricts, setShowDistricts] = useState(false)
	const ref = useRef<HTMLElement | null>(null)

	const translateY = Math.min(offset, scrolledPosition)
	const ratio = Math.min(1, scrolledPosition / offset)
	const navStyle = { transform: `translateY(-${translateY}px)` }
	const logoStyle = {
		transform: `scale(${Math.max(0.7, 1 - ratio)})`,
		marginTop: `-${ratio * 10}px`
	}

	useEffect(() => {
		setOffset(parseInt(getComputedStyle(ref.current).paddingTop))
	}, [ref])

	useEffect(() => {
		const handleRouteChangeStart = (path: string) => setShowDistricts(false)
		router.events.on('routeChangeStart', handleRouteChangeStart)
		return () => router.events.off('routeChangeStart', handleRouteChangeStart)
	}, [])

	return (
		<>
			<div className={cn(s.logo, isHome && s.home)} style={logoStyle}>
				<Link href={'/'}>B</Link>
			</div>
			<nav className={s.menu} style={navStyle} ref={ref}>
				<div className={s.top} style={{ opacity: (1 - ratio) }}>
					<h2>{district.name}</h2>
					<div className="small" >
						<a href={district.facebook}>Facebook</a>
						<a href={district.instagram}>Instagram</a>
						<Link href="/english">English</Link>
					</div>
				</div>
				<div className={s.wrapper} >
					<ul className={cn(isHome && s.home)}>
						<li className={cn(isHome && s.active)}>
							<Link href="/">Hem</Link>
						</li>
						<li className={cn(asPath.startsWith('/aktuellt') && s.active)}>
							<Link href="/aktuellt">Aktuellt</Link>
						</li>
						<li className={cn(asPath.startsWith('/projekt') && s.active)}>
							<Link href="/projekt">Projekt</Link>
						</li>
						<li className={cn(showDistricts && s.active)} onClick={() => setShowDistricts(!showDistricts)}>
							Distrikt
						</li>
						<li className={cn(asPath.startsWith('/om') && s.active)}>
							<Link href="/om">Om oss</Link>
						</li>
						<li className={cn(asPath.startsWith('/kontakt') && s.active)}>
							<Link href="/kontakt">Kontakt</Link>
						</li>
					</ul>
					<span className="mid">Sök</span>
				</div>
			</nav>
			<nav className={cn(s.districts, showDistricts && s.show)}>
				<h3>Besök våra distrikt</h3>
				<ul>
					{districts.filter(({ subdomain }) => primarySubdomain !== subdomain).map(({ id, subdomain, name }) =>
						<li key={id}>
							<Link href={`/`} locale={subdomain}>{name}</Link>
						</li>
					)}
				</ul>
			</nav>
		</>
	)
}
