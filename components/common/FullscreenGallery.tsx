'use client';

import s from './FullscreenGallery.module.scss';
import cn from 'classnames';
import { Markdown } from 'next-dato-utils/components';
import { Image } from 'react-datocms';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper/modules';
import SwiperCore from 'swiper';
import React, { useState, useRef, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Loader, Modal } from '@/components';
import { useStore, useShallow } from '@/lib/store';

SwiperCore.use([EffectFade]);

export type FullscreenGalleryProps = {};

export default function FullscreenGallery({}: FullscreenGalleryProps) {
	const [images, imageId, setImageId] = useStore(
		useShallow((state) => [state.images, state.imageId, state.setImageId]),
	);
	const swiperRef = useRef<SwiperType | null>(null);
	const [realIndex, setRealIndex] = useState(0);
	const [title, setTitle] = useState<string>();
	const [loaded, setLoaded] = useState<Record<string, boolean>>({});
	const [initLoaded, setInitLoaded] = useState(false);
	const isSingleSlide = images?.length === 1;
	const isHidden = !images || !imageId;
	const index = images?.findIndex((image) => image?.id === imageId) ?? 0;

	useEffect(() => {
		if (images && images[realIndex]?.title) setTitle(images[realIndex]?.title);
	}, [realIndex, images, setTitle]);

	useEffect(() => {
		setRealIndex(index);
	}, [index]);

	useEffect(() => {
		const handleKeys = ({ key }: KeyboardEvent) => {
			if (isHidden) return;
			if (key === 'ArrowRight') swiperRef?.current?.slideNext();
			if (key === 'ArrowLeft') swiperRef?.current?.slidePrev();
			if (key === 'Escape') setImageId(null);
		};
		document.addEventListener('keydown', handleKeys);
		return () => document.removeEventListener('keydown', handleKeys);
	}, [isHidden]);

	useEffect(() => {
		setTimeout(() => setInitLoaded(true), 300);
	}, [initLoaded]); // Delay loader

	if (isHidden) return null;

	return (
		<Modal>
			<div className={cn(s.gallery, images.length <= 1 && s.noArrows, isSingleSlide && s.noArrows)}>
				{!isSingleSlide && (
					<>
						<div className={s.back} onClick={() => swiperRef.current?.slidePrev()}>
							<button>‹</button>
						</div>
						<div className={s.forward} onClick={() => swiperRef.current?.slideNext()}>
							<button>›</button>
						</div>
					</>
				)}
				<div className={s.images} onClick={() => !isSingleSlide && swiperRef?.current?.slideNext()}>
					<Swiper
						id={`main-gallery`}
						loop={true}
						spaceBetween={0}
						centeredSlides={true}
						simulateTouch={!isSingleSlide}
						slidesPerView={1}
						initialSlide={index}
						onSlideChange={({ realIndex }) => setRealIndex(realIndex)}
						onSwiper={(swiper) => (swiperRef.current = swiper)}
					>
						{images.map((image, idx) => (
							<SwiperSlide key={idx} className={cn(s.slide)}>
								<Image
									imgClassName={s.image}
									data={image.responsiveImage}
									usePlaceholder={false}
									onLoad={() => setLoaded((l) => ({ ...l, [image.id]: true }))}
									fadeInDuration={0}
								/>
								{!loaded[image.id] && initLoaded && (
									<div className={s.loading}>
										<Loader />
									</div>
								)}
							</SwiperSlide>
						))}
					</Swiper>
				</div>

				<div className={s.caption}>
					{title && (
						<Markdown
							className={cn(s.text, 'small')}
							allowedElements={['em', 'p']}
							content={title}
						/>
					)}
				</div>
				<div className={cn(s.close, 'mid')} onClick={() => setImageId(null)}>
					STÄNG
				</div>
			</div>
		</Modal>
	);
}
