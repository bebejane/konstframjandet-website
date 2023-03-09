import s from './Menu.module.scss'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import useStore from '/lib/store'
import { useScrollInfo } from 'dato-nextjs-utils/hooks'
import { useWindowSize } from 'usehooks-ts'
import useDevice from '/lib/hooks/useDevice'
import { usePage } from '/lib/context/page'

export type MenuProps = { districts: DistrictRecord[] }

export default function Menu({ districts }: MenuProps) {
	const router = useRouter()
	const { district } = usePage()
	const [showDistricts, setShowDistricts] = useState(false)

	useEffect(() => {
		const handleRouteChangeStart = (path: string) => setShowDistricts(false)
		router.events.on('routeChangeStart', handleRouteChangeStart)
		return () => router.events.off('routeChangeStart', handleRouteChangeStart)
	}, [])


	return (
		<>
			<nav className={cn(s.menu)}>
				<h2>{district.name}</h2>
				<div className={s.wrapper}>
					<ul>
						<li>
							<Link href="/">Hem</Link>
						</li>
						<li>
							<Link href="/nyheter">Nyheter</Link>
						</li>
						<li>
							<Link href="/projekt">Projekt</Link>
						</li>
						<li
							className={cn(showDistricts && s.active)}
							onClick={() => setShowDistricts(!showDistricts)}
						>
							Distrikt
						</li>
						<li>
							<Link href="/om">Om oss</Link>
						</li>
						<li>
							<Link href="/kontakt">Kontakt</Link>
						</li>
					</ul>
					<span className="mid">Sök</span>
				</div>
			</nav>
			<nav className={cn(s.districts, showDistricts && s.show)}>
				<h3>Besök våra distrikt</h3>
				<ul>
					{districts.map(({ id, subdomain, name }) =>
						<li key={id}>
							<Link href={`/`} locale={subdomain}>{name}</Link>
						</li>
					)}
				</ul>
			</nav>
		</>
	)
}
