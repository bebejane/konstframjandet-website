'use client';

import s from './ProjectCard.module.scss';
import cn from 'classnames';
import { Markdown } from 'next-dato-utils/components';
import { Image } from 'react-datocms/image';
import { truncateWords } from '@/lib/utils';
import Link from '@/components/nav/Link';
import useDevice from '@/lib/hooks/useDevice';

export type CardProps = {
	project: ProjectRecord;
	index: number;
	total: number;
};

export default function ProjectCard({
	project: { id, title, intro, image, slug, color },
	project,
	index,
	total,
}: CardProps) {
	const { isMobile } = useDevice();

	return (
		<>
			<li className={s.card} key={id}>
				<Link href={`/projekt/${slug}`}>
					<figure>
						<div className={s.text}>
							{image?.responsiveImage && (
								<Image data={image.responsiveImage} className={s.image} objectFit='cover' />
							)}
							{color?.hex && (
								<div className={s.bgcolor} style={{ backgroundColor: color.hex }}></div>
							)}
							<h1>{truncateWords(title, isMobile ? 200 : 70)}</h1>
							<Markdown
								className={cn(s.intro)}
								content={intro?.replaceAll('\n', ' ')}
								truncate={isMobile ? 400 : 200}
							/>
						</div>
					</figure>
				</Link>
			</li>
			{index % 2 === 1 && <hr className={cn(s.divider, total % 2 === 0 && s.odd)} />}
		</>
	);
}
