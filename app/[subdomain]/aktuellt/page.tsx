import s from './index.module.scss';
import cn from 'classnames';
import withGlobalProps from '@/lib/withGlobalProps';
import { AllNewsDocument, DistrictBySubdomainDocument } from '@/graphql';
import { NewsCard, NewsContainer, Bubble, Loader } from '@/components';
import useStore from '@/lib/store';
//import { useApiQuery } from 'dato-nextjs-utils/hooks';
import { apiQuery } from 'next-dato-utils/api';
import { pageSize } from '@/lib/utils';
import { notFound } from 'next/navigation';

export type Props = {
	news: NewsRecord[];
	district: DistrictRecord;
	pagination: {
		count: number;
	};
};

export default async function News({ params }: PageProps<'/[subdomain]/aktuellt'>) {
	const { subdomain } = await params;
	const { district } = await apiQuery(DistrictBySubdomainDocument, { variables: { subdomain } });
	if (!district) return notFound();

	const { allNews, _allNewsMeta } = await apiQuery(AllNewsDocument, {
		variables: { districtId: district.id, first: pageSize },
	});

	// const [view] = useStore((state) => [state.view]);

	// const {
	// 	data: { news },
	// 	loading,
	// 	error,
	// 	nextPage,
	// 	page,
	// } = useApiQuery<{ news: NewsRecord[] }>(AllNewsDocument, {
	// 	initialData: { news: newsFromProps, pagination },
	// 	variables: { first: pageSize, districtId: district.id },
	// 	pageSize,
	// });

	return (
		<>
			news list
			{/* <div className={cn(s.container, view && s.list)}>
				<NewsContainer view={view}>
					{news.map((item) => (
						<NewsCard key={item.id} news={item} view={view} />
					))}
				</NewsContainer>
				{error && <p className='error'>Något gick fel: {error.message}</p>}
				{!page.end && (
					<Bubble className={s.more} onClick={nextPage}>
						{loading ? <Loader className={s.loader} /> : 'Fler'}
					</Bubble>
				)}
			</div> */}
		</>
	);
}

// export const getStaticProps = withGlobalProps(
// 	{ queries: [] },
// 	async ({ props, revalidate, context }: any) => {
// 		const districtId = props.district.id as string;
// 		const { news, pagination } = await apiQuery(AllNewsDocument, {
// 			variables: { districtId, first: pageSize },
// 			preview: context.preview,
// 		});

// 		return {
// 			props: {
// 				...props,
// 				news,
// 				pagination,
// 				page: {
// 					title: 'Aktuellt',
// 					layout: 'news',
// 				} as PageProps,
// 			},
// 			revalidate,
// 		};
// 	},
// );
