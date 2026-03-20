'use client';
import s from './Image.module.scss';
import cn from 'classnames';
import { Image as DatoImage } from 'react-datocms';
import { Markdown } from 'next-dato-utils/components';
import useStore, { useShallow } from '@/lib/store';

export type ImageBlockProps = {
	id: string;
	data: ImageRecord;
};

export default function Image({ id, data: { image, layout } }: ImageBlockProps) {
	const [setImageId] = useStore(useShallow((state) => [state.setImageId]));
	return (
		<figure className={cn(s.container, layout && s[layout])} onClick={() => setImageId(image.id)}>
			<DatoImage data={image.responsiveImage} className={s.image} />
			{image.title && (
				<figcaption>
					<Markdown allowedElements={['em', 'p']} content={image.title} />
				</figcaption>
			)}
		</figure>
	);
}
