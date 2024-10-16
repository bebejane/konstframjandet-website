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
					<Link href={'https://www.konstframjandet.se'} scroll={true}>
						<span className={s.logo}>B</span>
					</Link>
					<div className={s.mobile}>
						<Link href={'https://www.konstframjandet.se'} scroll={true}>
							Konstfrämjandet
						</Link><br />
						<br />
						Konstfrämjandet är en organisation bildad 1947 som arbetar med konstbildning
						och med att föra ut konst till människor i deras vardag. Vi verkar i hela Sverige.
					</div>
				</div>
				<ul>
					{menu
						/*
						.filter(({ type }) => type !== 'home')
						.filter(({ type }) => !(type === 'project' && isMainDistrict))
						.filter(({ type }) => !(type === 'district' && !isMainDistrict))
						.filter(({ type }) => !(type === 'contact' && isMainDistrict))*/
						.filter(({ type }) => type === 'contact' || type === 'about')

						.map(({ type, label, slug, items, subdomain }, idx) =>
							<li key={idx} className={cn(isMainDistrict && type === 'district' && s.double)}>
								{slug ? <Link href={slug} locale={subdomain}>{label}</Link> : <>{label}</>}
								<ul>
									{items?.map(({ type, label, slug, subdomain }, idx) =>
										<li key={`${idx}-sub`}>
											<Link
												href={(type === 'district' && process.env.NODE_ENV === 'production') ? `https://${subdomain}.konstframjandet.se` : slug}
												scroll={true}
												locale={subdomain}
											>{label}</Link>
										</li>
									)}
								</ul>
							</li>
						)}
					<li>
						<Link href={'https://www.konstframjandet.se'} scroll={true}>
							Konstfrämjandet
						</Link><br />
						<br />
						Konstfrämjandet är en organisation bildad 1947 som arbetar med konstbildning
						och med att föra ut konst till människor i deras vardag. Vi verkar i hela Sverige.
					</li>
				</ul>
			</nav >
		</footer >
	)
}