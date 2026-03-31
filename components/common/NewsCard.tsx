'use client';

import s from './NewsCard.module.scss';
import cn from 'classnames';
import { Markdown } from 'next-dato-utils/components';
import { Image } from 'react-datocms/image';
import Link from '@/components/nav/Link';
import Balancer from 'react-balance-text';
import { usePathname } from 'next/navigation';
import useStore, { useShallow } from '@/lib/store';

export default function NewsCard({
	id,
	title,
	subtitle,
	intro,
	image,
	slug,
	where,
	date,
	time,
	misc,
}: AllNewsQuery['allNews'][number]) {
	const [view] = useStore(useShallow((state) => [state.view]));
	const pathname = usePathname();
	const isHome = pathname === '/' || pathname === `/index`;

	return (
		<li id={id} className={cn(s.card, isHome && s.home, view === 'list' && s.list)}>
			<div className={s.content}>
				<Link href={`/aktuellt/${slug}`}>
					<h2 className='big'>
						<Balancer>
							{title}
							{subtitle && <span> — {subtitle}</span>}
						</Balancer>
					</h2>
				</Link>
				<Markdown className='big' content={intro} />
				<div className={cn(s.meta, 'mid')}>
					{where && <span>{where}</span>}
					{date && <span>{date}</span>}
					{time && <span>{time}</span>}
					<span>
						<Link href={`/aktuellt/${slug}`}>Läs mer</Link>
					</span>
				</div>
			</div>
			{image?.responsiveImage && (
				<Link href={`/aktuellt/${slug}`}>
					<figure className={s.figure}>
						<Image data={image.responsiveImage} className={s.image} />
					</figure>
				</Link>
			)}
		</li>
	);
}
