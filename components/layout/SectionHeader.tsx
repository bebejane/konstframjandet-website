'use client';

import s from './SectionHeader.module.scss';
import cn from 'classnames';
import useStore, { useShallow } from '@/lib/store';
import { Image } from 'react-datocms';
import { Markdown } from 'next-dato-utils/components';
import ListIcon from '@/public/images/list.svg';
import ThumbIcon from '@/public/images/thumb.svg';
import Balancer from 'react-balance-text';
import Icon from '@/components/common/Icon';

export type SectionHeaderProps = {
	layout: 'full' | 'project' | 'home' | 'news' | 'contact';
	title?: string | null;
	subtitle?: string | null;
	image?: FileField | null;
	intro?: string | null;
	color?: string | null;
	colorOption?: string | null;
};

export default function SectionHeader({
	title,
	subtitle,
	image,
	intro,
	layout,
	color,
	colorOption,
}: SectionHeaderProps) {
	const [view, setView] = useStore(useShallow((state) => [state.view, state.setView]));
	const noImage = !image?.responsiveImage;

	return (
		<header
			className={cn(s.header, s[layout], colorOption && s[colorOption], noImage && s.noimage)}
		>
			{(title || subtitle) && (
				<h1>
					<span>
						<Balancer>
							{title}
							{subtitle && ` — ${subtitle}`}
						</Balancer>
					</span>{' '}
					<div className={s.fade} />
				</h1>
			)}
			{!noImage && image?.responsiveImage && (
				<figure>
					<Image
						data={{ ...image.responsiveImage, alt: image.title }}
						className={s.image}
						pictureClassName={s.image}
						objectFit='cover'
					/>
				</figure>
			)}
			{intro && (
				<>
					<div className={s.introWrapper}>
						<Markdown className={cn(s.intro, 'intro')} content={intro?.replaceAll('\n', ' ')} />
						<div className={s.fade} />
					</div>
				</>
			)}
			{color && !noImage && <div className={s.bgcolor} style={{ backgroundColor: color }}></div>}
			{layout === 'news' && (
				<span
					className={cn(s.view, 'mid')}
					onClick={() => setView(view === 'full' ? 'list' : 'full')}
				>
					{view === 'list' ? (
						<Icon src={ListIcon} nofill={true} />
					) : (
						<Icon src={ThumbIcon} nofill={true} />
					)}
				</span>
			)}
		</header>
	);
}
