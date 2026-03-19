import s from './Logo.module.scss'
import { Image } from 'react-datocms'

export type Props = { data: LogoRecord }

export default function Logo({ data: { logotypes } }: Props) {

	return (
		<ul className={s.logotypes}>
			{logotypes.map((image) =>
				<li key={image.id}>
					{image.responsiveImage && <Image data={image.responsiveImage} className={s.image} objectFit="contain" />}
				</li>
			)}
		</ul>
	)
}