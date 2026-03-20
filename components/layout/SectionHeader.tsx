'use client';

import s from './SectionHeader.module.scss';
import cn from 'classnames';
import { usePage } from '@/lib/context/page';
import useStore from '@/lib/store';
import { Image } from 'react-datocms';
import { Markdown } from 'next-dato-utils/components';
import ListIcon from '@/public/images/list.svg';
import ThumbIcon from '@/public/images/thumb.svg';
import Balancer from 'react-wrap-balancer';

export default function SectionHeader() {
	const { title, subtitle, image, intro, layout, color, colorOption } = usePage();
	const [view, setView] = useStore((state) => [state.view, state.setView]);
	const noImage = !image?.responsiveImage;

	return (
		<header
			className={cn(s.header, s[layout], colorOption && s[colorOption], noImage && s.noimage)}
		>
			<h1>
				<Balancer>
					<span>
						{title}
						{subtitle && ` — ${subtitle}`}
					</span>{' '}
				</Balancer>
				<div className={s.fade}></div>
			</h1>
			{!noImage && image.responsiveImage && (
				<figure>
					<Image
						data={image.responsiveImage}
						className={s.image}
						pictureClassName={s.image}
						objectFit='cover'
						//alt={image.title}
					/>
				</figure>
			)}
			{intro && (
				<>
					<div className={s.introWrapper}>
						<Markdown className={cn(s.intro, 'intro')} content={intro?.replaceAll('\n', ' ')} />
						<div className={s.fade}></div>
					</div>
				</>
			)}
			{color && !noImage && <div className={s.bgcolor} style={{ backgroundColor: color }}></div>}
			{/* {layout === 'news' && ( */}
			<span
				className={cn(s.view, 'mid')}
				onClick={() => setView(view === 'full' ? 'list' : 'full')}
			>
				{view === 'list' ? <ThumbIcon /> : <ListIcon />}
				Hej
			</span>
			{/* )} */}
		</header>
	);
}
