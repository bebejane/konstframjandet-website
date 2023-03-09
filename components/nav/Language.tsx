import s from './Language.module.scss'
import cn from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { capitalize } from '/lib/utils'
export default function Language() {
	const { locale, locales, asPath } = useRouter()

	return (
		<nav className={s.language}>
			{locales.map((l, idx) =>
				<Link
					key={idx}
					href={asPath}
					locale={l}
					className={cn(locale === l && s.selected)}
				>
					{capitalize(l)}
				</Link>
			)}
		</nav>
	)
}
