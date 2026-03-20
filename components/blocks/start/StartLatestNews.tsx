import s from './StartLatestNews.module.scss';
import { NewsContainer, NewsCard } from '@/components';
import Link from '@/components/nav/Link';

export type Props = {
	data: {
		news?: NewsRecord[];
	};
};

export default function StartLatestNews({ data: { news } }: Props) {
	return (
		<section className={s.container}>
			<header className='mid'>
				<h2>Aktuellt</h2>
				<Link href={'/aktuellt'} className='mid'>
					Visa alla
				</Link>
			</header>
			<NewsContainer>
				{news?.map((item) => (
					<NewsCard key={item.id} news={item} />
				))}
			</NewsContainer>
		</section>
	);
}
