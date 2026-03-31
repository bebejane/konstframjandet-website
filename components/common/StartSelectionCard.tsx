import config from '@/datocms.config';
import s from './StartSelectionCard.module.scss';
import cn from 'classnames';
import { Markdown } from 'next-dato-utils/components';
import { Image } from 'react-datocms/image';
import Link from '@/components/nav/Link';
import { getTenantUrl } from '@/lib/tenancy';

export type CardProps = {
	item: NewsRecord | ProjectRecord;
};

export default async function StartSelectionCard({ item }: CardProps) {
	const href = await config.route(item);
	if (!href) return null;

	return (
		<li className={s.card} key={item.id}>
			<Link href={href} district={item.district as DistrictRecord}>
				<figure className={s.figure}>
					{item.image && (
						<Image
							data={item.image.responsiveImage}
							imgClassName={s.image}
							placeholderClassName={s.image}
							objectFit='cover'
						/>
					)}
				</figure>
			</Link>
			<Link href={href} district={item.district as DistrictRecord}>
				<h3>{item.title}</h3>
			</Link>
			{item.intro && <Markdown className='body-small' content={item.intro} />}
			<Link href={href} district={item.district as DistrictRecord} className={cn('small', s.more)}>
				Läs mer
			</Link>
		</li>
	);
}
