import s from './DownloadPdf.module.scss';
import NextLink from 'next/link';
import { Image } from 'react-datocms';

export type Props = { data: DownloadPdfRecord };

export default function DownloadPdf({ data: { url, image, text } }: Props) {
	return (
		<NextLink className={s.button} href={url}>
			<button>
				<Image data={image.responsiveImage} className={s.image} />
				<span>{text}</span>
			</button>
		</NextLink>
	);
}
