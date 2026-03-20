import s from './page.module.scss';
import cn from 'classnames';
import withGlobalProps from '@/lib/withGlobalProps';
import { AllNewsDocument, DistrictBySubdomainDocument } from '@/graphql';
import { NewsCard, NewsContainer, Bubble, Loader } from '@/components';
import useStore from '@/lib/store';
//import { useApiQuery } from 'dato-nextjs-utils/hooks';
import { apiQuery } from 'next-dato-utils/api';
import { pageSize } from '@/lib/utils';
import { notFound } from 'next/navigation';
import NewsLoader from '@/app/[subdomain]/aktuellt/NewsLoader';

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
		variables: { districtId: district.id, first: pageSize, skip: 0 },
	});

	return (
		<div className={s.container}>
			<NewsLoader
				allNews={allNews}
				district={district as DistrictRecord}
				count={_allNewsMeta.count}
			/>
		</div>
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
