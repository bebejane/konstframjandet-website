import s from './Image.module.scss'
import React from 'react'
import { Image as DatoImage } from 'react-datocms'
import { ImageGallery } from '/components'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components'

export type ImageBlockProps = {
	id: string,
	data: ImageRecord,
	onClick: Function
}

export default function Image({ id, data: { image, layout }, onClick }: ImageBlockProps) {

	return (

		<figure className={s.single} onClick={() => onClick?.(image.id)}>
			<DatoImage
				data={image.responsiveImage}
				className={s.image}
			/>
			{image.title &&
				<figcaption>
					<Markdown allowedElements={['em', 'p']}>{image.title}</Markdown>
				</figcaption>
			}
		</figure>
	)
}