'use client';

import s from './StartImageGallery.module.scss';
import cn from 'classnames';
import { useState, useRef } from 'react';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import type { Swiper } from 'swiper';
import { Image } from 'react-datocms';
import { Bubble } from '@/components';
import Link from '@/components/nav/Link';
import { getRoute } from '@/datocms.config';

export type ExternalLinkQuery = {
	linkImage: FileField;
	linkIntro: string;
};

export type StartImageGalleryRecordExtended = {
	links: (StartImageGalleryModelLinksField & ExternalLinkQuery)[];
};

export type Props = {
	data: StartImageGalleryRecordExtended;
};

export default function StartImageGallery({ data: { links } }: Props) {
	const swiperRef = useRef<Swiper | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [index, setIndex] = useState(0);

	return (
		<section className={s.gallery} ref={containerRef}>
			<SwiperReact
				id={`swiper-wrap`}
				className={s.swiper}
				loop={true}
				noSwiping={false}
				simulateTouch={true}
				slidesPerView={'auto'}
				initialSlide={index}
				onSlideChange={({ realIndex }) => setIndex(realIndex)}
				onSwiper={(swiper) => (swiperRef.current = swiper)}
			>
				{links.map((item, idx) => {
					const image = item.image ?? item.linkImage;
					return (
						<SwiperSlide key={idx} className={s.slide}>
							<Link href={getRoute(item)}>
								<figure>
									{image.responsiveImage && (
										<Image
											data={image.responsiveImage}
											className={s.picture}
											pictureClassName={s.picture}
											placeholderClassName={s.picture}
											objectFit={'cover'}
										/>
									)}
									<figcaption>
										<header>
											<div className={s.fade}></div>
											<h1>{item.title}</h1>
										</header>
										<div className={s.intro}>
											<p className='intro'>{item.intro || item.linkIntro}</p>
											<div className={s.fade}></div>
										</div>
									</figcaption>
								</figure>
								<Bubble className={cn(s.bubble, 'mid')}>Visa</Bubble>
							</Link>
						</SwiperSlide>
					);
				})}
			</SwiperReact>
			<div className={s.prev}>
				<Bubble onClick={() => swiperRef.current?.slidePrev()}>‹</Bubble>
			</div>
			<div className={s.next}>
				<Bubble onClick={() => swiperRef.current?.slideNext()}>›</Bubble>
			</div>
			<nav className={s.pagination}>
				{links.map((item, idx) => (
					<div
						key={idx}
						onClick={() => swiperRef.current?.slideTo(idx)}
						className={cn(index === idx && s.selected)}
					>
						<span></span>
					</div>
				))}
			</nav>
		</section>
	);
}
