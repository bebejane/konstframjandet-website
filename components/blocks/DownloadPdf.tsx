import s from './DownloadPdf.module.scss'
import React from 'react'
import Link from 'next/link'
import { Image } from 'react-datocms'
export type Props = { data: DownloadPdfRecord }

export default function DownloadPdf({ data: { url, image } }: Props) {

	return (
		<Link className={s.button} href={url}>
			<Image data={image.responsiveImage} className={s.image} />
		</Link>
	)
}