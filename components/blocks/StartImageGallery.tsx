import s from './ImageGallery.module.scss'
import cn from 'classnames'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import type { Swiper } from 'swiper';
import { Image } from 'react-datocms'
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components';
import { useWindowSize } from 'rooks';

export type Props = {
	data: StartImageGalleryRecord
}

export default function StartImageGallery({ data: { id, links } }: Props) {

	const swiperRef = useRef<Swiper | null>(null)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [index, setIndex] = useState(0)

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
				onSwiper={(swiper) => swiperRef.current = swiper}
			>
				{links.map((item, idx) =>
					<SwiperSlide key={idx} className={cn(s.slide)} >
						<figure id={`${id}-${item.id}`}>
							{item.image &&
								<Image
									data={item.image.responsiveImage}
									className={s.image}
									pictureClassName={s.picture}
									placeholderClassName={s.picture}
									objectFit={'cover'}
								/>
							}
							<figcaption>
								{item.title && <Markdown allowedElements={['em', 'p']}>{item.title}</Markdown>}
							</figcaption>
						</figure>
					</SwiperSlide>
				)}
			</SwiperReact>
		</div>
	)
}