import s from './DownloadPdf.module.scss'
import React from 'react'
import Link from 'next/link'

export type Props = { data: DownloadPdfRecord }

export default function DownloadPdf({ data: { url, image } }: Props) {

	return (
		<Link className={s.button} href={url}>
			<button>Ladda ner PDF</button>
		</Link>
	)
}