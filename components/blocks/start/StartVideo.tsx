import s from "./StartVideo.module.scss"
import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "rooks"
import Youtube from 'react-youtube'
import Vimeo from '@u-wave/react-vimeo'
import { DatoMarkdown as Markdown } from "dato-nextjs-utils/components";

export default function StartVideo({ data }) {

	const ref = useRef<HTMLDivElement | null>(null)
	const [height, setHeight] = useState(360);
	const { innerWidth, innerHeight } = useWindowSize()

	useEffect(() => setHeight((ref.current?.clientWidth / 16) * 9), [innerWidth, innerHeight, data, ref]) // Set to 16:9

	if (!data || !data.video) return null

	const { provider, providerUid, title } = data.video
	const style = { height: `${height}px`, width: '100%' }

	return (
		<div className={s.video} ref={ref} >
			{provider === 'youtube' ?
				<Youtube
					opts={{
						playerVars: {
							autoplay: false,
							controls: 0,
							rel: 0
						}
					}}
					videoId={providerUid}
					className={s.player}
					style={style}
				/>
				: provider === 'vimeo' ?
					<Vimeo video={providerUid} className={s.player} style={style} />
					:
					<div>{provider} not supported!</div>
			}
			{title &&
				<Markdown className={s.caption} allowedElements={['em', 'p']}>{title}</Markdown>
			}
		</div>
	)
}