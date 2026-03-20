'use client';

import s from './NewsLoader.module.scss';
import { AllNewsDocument } from '@/graphql';
import { NewsCard, NewsContainer, Bubble, Loader } from '@/components';
import useStore, { useShallow } from '@/lib/store';
import { useApiQuery } from 'next-dato-utils/hooks';
import { pageSize } from '@/lib/utils';

export type Props = {
	allNews: AllNewsQuery['allNews'];
	district: DistrictRecord;

	count: number;
};

export default function NewsLoader({ allNews: _allNews, district, count }: Props) {
	const [view] = useStore(useShallow((state) => [state.view]));

	const {
		data: { allNews },
		loading,
		error,
		nextPage,
		page,
	} = useApiQuery(AllNewsDocument, {
		initialData: { allNews: _allNews, pagination: { count } },
		variables: { first: pageSize, districtId: district.id },
		pageSize,
	});

	return (
		<>
			<NewsContainer view={view}>
				{allNews.map((item) => (
					<NewsCard key={item.id} news={item as NewsRecord} view={view} />
				))}
			</NewsContainer>
			{error && <p className='error'>Något gick fel: {error.message}</p>}
			{!page?.end && (
				<Bubble className={s.more} onClick={nextPage}>
					{loading ? <Loader className={s.loader} /> : 'Fler'}
				</Bubble>
			)}
		</>
	);
}
