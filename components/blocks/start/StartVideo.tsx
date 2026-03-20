'use client';

import s from './StartVideo.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'rooks';
import Youtube from 'react-youtube';
import Vimeo from '@u-wave/react-vimeo';
import { Markdown } from 'next-dato-utils/components';

export default function StartVideo({ data }: { data: VideoRecord }) {
	const ref = useRef<HTMLDivElement | null>(null);
	const [height, setHeight] = useState(360);
	const { innerWidth, innerHeight } = useWindowSize();

	useEffect(() => {
		if (!ref.current) return;
		setHeight((ref.current.clientWidth / 16) * 9);
	}, [innerWidth, innerHeight, data, ref]);

	if (!data || !data.video) return null;

	const { provider, providerUid, title } = data.video;
	const style = { height: `${height}px`, width: '100%' };

	return (
		<div className={s.video} ref={ref}>
			{provider === 'youtube' ? (
				<Youtube
					opts={{
						playerVars: {
							autoplay: false,
							controls: 0,
							rel: 0,
						},
					}}
					videoId={providerUid}
					className={s.player}
					style={style}
				/>
			) : provider === 'vimeo' ? (
				<Vimeo video={providerUid} className={s.player} style={style} />
			) : (
				<div>{provider} not supported!</div>
			)}
			{title && <Markdown className={s.caption} allowedElements={['em', 'p']} content={title} />}
		</div>
	);
}
