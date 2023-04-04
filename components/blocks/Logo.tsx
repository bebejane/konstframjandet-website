import s from './Logo.module.scss'
import React from 'react'
import { Image } from 'react-datocms'

export type Props = { data: LogoRecord }

export default function Logo({ data: { logotypes } }: Props) {

	return (
		<ul className={s.logotypes}>
			{logotypes.map((image) =>
				<li key={image.id}>
					<Image data={image.responsiveImage} className={s.image} objectFit="contain" />
				</li>
			)}
		</ul>
	)
}