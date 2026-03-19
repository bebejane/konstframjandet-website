import s from './Button.module.scss'
import Link from 'next/link'

export type Props = { data: ButtonRecord }

export default function Button({ data: { text, url } }: Props) {

	return (
		<Link className={s.button} href={url}>
			<button>{text}</button>
		</Link>
	)
}