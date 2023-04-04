import s from './StartImageGallery.module.scss'
import cn from 'classnames'
import React, { useState, useRef } from 'react'
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import type { Swiper } from 'swiper';
import { Image } from 'react-datocms'
import { recordToSlug } from '/lib/utils';
import { Bubble } from '/components'
import Link from 'next/link';

export type ExternalLinkQuery = {
	linkImage: FileField
	linkIntro: string
}

export type StartImageGalleryRecordExtended = {
	links: (StartImageGalleryModelLinksField & ExternalLinkQuery)[]
}

export type Props = {
	id: string
	data: StartImageGalleryRecordExtended
}

export default function StartImageGallery({ id, data: { links } }: Props) {

	const swiperRef = useRef<Swiper | null>(null)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [index, setIndex] = useState(0)

	return (
		<section className={s.gallery} ref={containerRef}>
			<SwiperReact
				id={`${id}-swiper-wrap`}
				className={s.swiper}
				loop={true}
				noSwiping={false}
				simulateTouch={true}
				slidesPerView={'auto'}
				initialSlide={index}
				onSlideChange={({ realIndex }) => setIndex(realIndex)}
				onSwiper={(swiper) => swiperRef.current = swiper}
			>
				{links.map((item, idx) =>
					<SwiperSlide key={idx} className={s.slide}>
						<Link href={recordToSlug(item)}>
							<figure>
								{(item.image || item.linkImage) &&
									<Image
										data={(item.image || item.linkImage).responsiveImage}
										className={s.picture}
										pictureClassName={s.picture}
										placeholderClassName={s.picture}
										objectFit={'cover'}
									/>
								}
								<figcaption>
									<header>
										<div className={s.fade}></div>
										<h1>
											{item.title}
										</h1>
									</header>
									<div className={s.intro}>
										<p className="intro">{(item.intro || item.linkIntro)}</p>
										<div className={s.fade}></div>
									</div>
								</figcaption>
							</figure>
							<Bubble className={cn(s.bubble, 'mid')}>Visa</Bubble>
						</Link>
					</SwiperSlide>
				)}
			</SwiperReact>
			<div className={s.prev}><Bubble onClick={() => swiperRef.current.slidePrev()}>‹</Bubble></div>
			<div className={s.next}><Bubble onClick={() => swiperRef.current.slideNext()}>›</Bubble></div>
		</section>
	)
}