import s from './FullscreenVideo.module.scss'
import React from 'react'
import { VideoPlayer } from '/components'
import Link from 'next/link'
import { useRef } from 'react'

export type FullscreenVideoProps = { data: FullscreenVideoRecord }

export default function FullscreenVideo({ data: { video, text, link } }: FullscreenVideoProps) {

	const ref = useRef()

	return (
		<section className={s.fullScreenVideo} ref={ref}>
			<Link scroll={false} href={link}>
				<a>
					<VideoPlayer data={video} />
				</a>
			</Link>
			<div className={s.textWrap}>
				<div className={s.text}>
					<div><h1 className="start">{text}</h1></div>
					<div className={s.link}>
						<Link scroll={false} href={link}>
							<a>
								<span className="medium white">
									link
								</span>
							</a>
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}