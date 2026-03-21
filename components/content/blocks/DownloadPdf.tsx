import s from './DownloadPdf.module.scss';
import Link from '@/components/nav/Link';
import { Image } from 'react-datocms';

export type Props = { data: DownloadPdfRecord };

export default function DownloadPdf({ data: { url, image, text } }: Props) {
	return (
		<Link className={s.button} href={url}>
			<button>
				<Image data={image.responsiveImage} className={s.image} />
				<span>{text}</span>
			</button>
		</Link>
	);
}
