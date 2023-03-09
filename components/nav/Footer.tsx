import s from './Footer.module.scss'
import cn from 'classnames'
import type { Menu, MenuItem } from '/lib/menu'
import Link from 'next/link'
import { usePage } from '/lib/context/page'

export type FooterProps = {
	footer: any
	menu: Menu
}

export default function Footer({ footer, menu }: FooterProps) {

	const { district } = usePage()
	//console.log(menu)
	return (
		<footer className={cn(s.footer)} id="footer">
			<div className={s.line}></div>
			<nav>
				<div className={s.about}>
					<p>Konstfrämjandet</p>
					Konstfrämjandet är en organisation bildad 1947 som arbetar med konstbildning
					och med att föra ut konst till människor i deras vardag. Vi verkar i hela Sverige.
				</div>
				<ul>
					{menu.map(({ type, label, slug, items, subdomain }, idx) =>
						<li key={idx}>
							{slug ? <Link href={slug} locale={subdomain}>{label}</Link> : <>{label}</>}
							<ul>
								{items?.map(({ type, label, slug, subdomain }) =>
									<li><Link href={slug} locale={subdomain}>{label}</Link></li>
								)}
							</ul>
						</li>
					)}
				</ul>
			</nav>
		</footer>
	)
}