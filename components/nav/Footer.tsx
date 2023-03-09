import s from './Footer.module.scss'
import cn from 'classnames'
import type { MenuItem } from '/lib/menu'

export type FooterProps = {
	menu: MenuItem[]
	footer: any
}

export default function Footer({ menu, footer }: FooterProps) {

	return (
		<footer className={cn(s.footer)} id="footer">

		</footer>
	)
}