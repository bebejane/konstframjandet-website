'use client';

import s from './ImageGallery.module.scss';
import { useCallback, useState, useRef, useEffect } from 'react';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import type { Swiper } from 'swiper';
import { Image } from 'react-datocms';
import { Markdown } from 'next-dato-utils/components';
import { useWindowSize } from 'rooks';
import useStore, { useShallow } from '@/lib/store';

export type ImageGalleryBlockProps = {
	data: ImageGalleryRecord;
};

export default function ImageGallery({ data: { id, images } }: ImageGalleryBlockProps) {
	const [setImageId] = useStore(useShallow((state) => [state.setImageId]));
	const swiperRef = useRef<Swiper | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [index, setIndex] = useState(0);
	const [arrowMarginTop, setArrowMarginTop] = useState(0);
	const { innerHeight, innerWidth } = useWindowSize();
	const [captionHeight, setCaptionHeight] = useState<number | undefined>();

	const calculatePositions = useCallback(() => {
		if (!containerRef.current) return;

		const images = containerRef.current.querySelectorAll<HTMLImageElement>('figure');
		let figureHeight = 0;

		Array.from(images).forEach((img) => {
			figureHeight = img.clientHeight > figureHeight ? img.clientHeight : figureHeight;
		});

		setArrowMarginTop(figureHeight / 2);

		let figcaptionHeight = 0;

		Array.from(containerRef.current.querySelectorAll<HTMLDivElement>('figure>figcaption')).forEach(
			(caption) => {
				caption.style.minHeight = '0px';
				figcaptionHeight =
					caption.clientHeight > figcaptionHeight || !figcaptionHeight
						? caption.clientHeight
						: figcaptionHeight;
				caption.style.minHeight = `${figcaptionHeight}px`;
			},
		);
	}, []);

	useEffect(() => {
		calculatePositions();
	}, [innerHeight, innerWidth]);

	if (!images || !images.length) return null;

	return (
		<div className={s.gallery} ref={containerRef}>
			<div className={s.fade}></div>
			<SwiperReact
				id={`${id}-swiper-wrap`}
				className={s.swiper}
				loop={true}
				noSwiping={false}
				simulateTouch={true}
				slidesPerView='auto'
				initialSlide={index}
				onSlideChange={({ realIndex }) => setIndex(realIndex)}
				onSwiper={(swiper) => (swiperRef.current = swiper)}
			>
				{images?.map((item, idx) => (
					<SwiperSlide key={`${idx}-${captionHeight}`} className={s.slide}>
						<figure id={item.id} onClick={() => setImageId(item.id)}>
							<Image data={item.responsiveImage} onLoad={calculatePositions} />
							<figcaption>
								{item.title && <Markdown allowedElements={['em', 'p']} content={item.title} />}
							</figcaption>
						</figure>
					</SwiperSlide>
				))}
			</SwiperReact>
			{images.length > 3 && (
				<div
					className={s.next}
					style={{ top: `${arrowMarginTop}px`, display: arrowMarginTop ? 'flex' : 'none' }}
					onClick={() => swiperRef.current?.slideNext()}
				>
					→
				</div>
			)}
		</div>
	);
}
