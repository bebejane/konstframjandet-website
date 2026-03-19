import s from './Image.module.scss'
import cn from 'classnames'
import { Image as DatoImage } from 'react-datocms'
import { Markdown } from 'next-dato-utils/components'

export type ImageBlockProps = {
	id: string,
	data: ImageRecord
	onClick: Function
}

export default function Image({ id, data: { image, layout }, onClick }: ImageBlockProps) {
	return (
		<figure className={cn(s.container, layout &&s[layout])} onClick={() => onClick?.(image.id)}>
			<DatoImage
				data={image.responsiveImage}
				className={s.image}
			/>
			{image.title &&
				<figcaption>
					<Markdown allowedElements={['em', 'p']} content={image.title}/>
				</figcaption>
			}
		</figure>
	)
}