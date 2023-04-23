import s from './Footer.module.scss'
import cn from 'classnames'
import type { Menu } from '/lib/menu'
import Link from 'next/link'
import { primarySubdomain } from '/lib/utils'
import { usePage } from '/lib/context/page'

export type FooterProps = {
	footer: any
	menu: Menu
	districts: DistrictRecord[]
}

export default function Footer({ footer, menu, districts }: FooterProps) {

	const { isMainDistrict } = usePage()

	return (
		<footer className={cn(s.footer)} id="footer">
			<div className={s.line}></div>
			<nav>
				<div className={s.about}>
					<span className={s.logo}>B</span>
					<Link href={'/'} scroll={true} locale={primarySubdomain}>
						Konstfrämjandet
					</Link>
					<br /><br />
					Konstfrämjandet är en organisation bildad 1947 som arbetar med konstbildning
					och med att föra ut konst till människor i deras vardag. Vi verkar i hela Sverige.
				</div>
				<ul>
					{menu
						.filter(({ type }) => type !== 'home')
						.filter(({ type }) => !(type === 'project' && isMainDistrict))
						.filter(({ type }) => !(type === 'district' && !isMainDistrict))
						.filter(({ type }) => !(type === 'contact' && isMainDistrict))
						.map(({ type, label, slug, items, subdomain }, idx) =>
							<li key={idx} className={cn(isMainDistrict && type === 'district' && s.double)}>
								{slug ? <Link href={slug} locale={subdomain}>{label}</Link> : <>{label}</>}
								<ul>
									{items?.map(({ label, slug, subdomain }, idx) =>
										<li key={`${idx}-sub`}>
											<Link
												href={slug}
												scroll={true}
												locale={subdomain}
											>{label}</Link>
										</li>
									)}
								</ul>
							</li>
						)}
				</ul>
			</nav >
		</footer >
	)
}