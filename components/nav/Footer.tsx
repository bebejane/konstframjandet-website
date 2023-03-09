import s from './Footer.module.scss'
import cn from 'classnames'
import type { MenuItem } from '/lib/menu'
import Link from 'next/link'

export type FooterProps = {
	footer: any
	districts: DistrictRecord[]
}

export default function Footer({ footer, districts }: FooterProps) {

	return (
		<footer className={cn(s.footer)} id="footer">
			<div className={s.line}></div>
			<div className={s.about}>
				<p>Konstfrämjandet</p>
				Konstfrämjandet är en organisation bildad 1947 som arbetar med konstbildning
				och med att föra ut konst till människor i deras vardag. Vi verkar i hela Sverige.
			</div>
			<ul>
				<li>
					Aktuellt
					<ul></ul>
				</li>
				<li>
					Projekt
					<ul></ul>
				</li>
				<li>
					Distrikt
					<ul>
						{districts.map(({ id, subdomain, name }) =>
							<li key={id}>
								<Link href={`/`} locale={subdomain}>{name}</Link>
							</li>
						)}
					</ul>
				</li>
				<li>
					Om
					<ul></ul>
				</li>
				<li>
					Kontakt
					<ul></ul>
				</li>
			</ul>
		</footer>
	)
}