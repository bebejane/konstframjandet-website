import s from './Footer.module.scss'
import cn from 'classnames'
import type { Menu } from '/lib/menu'
import Link from 'next/link'
import { primarySubdomain } from '/lib/utils'

export type FooterProps = {
	footer: any
	menu: Menu
}

export default function Footer({ footer, menu }: FooterProps) {

	return (
		<footer className={cn(s.footer)} id="footer">
			<div className={s.line}></div>
			<nav>
				<div className={s.about}>
					<p>
						<Link href={'/'} scroll={true} locale={primarySubdomain}>
							Konstfrämjandet
						</Link>
					</p>
					Konstfrämjandet är en organisation bildad 1947 som arbetar med konstbildning
					och med att föra ut konst till människor i deras vardag. Vi verkar i hela Sverige.
				</div>
				<ul>
					{menu.map(({ label, slug, items, subdomain }, idx) =>
						<li key={idx}>
							{slug ? <Link href={slug} locale={subdomain}>{label}</Link> : <>{label}</>}
							<ul>
								{items?.map(({ label, slug, subdomain }, idx) =>
									<li key={`${idx}-sub`}>
										<Link href={slug} scroll={true} locale={subdomain}>{label}</Link>
									</li>
								)}
							</ul>
						</li>
					)}
				</ul>
			</nav>
		</footer>
	)
}