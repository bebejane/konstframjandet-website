import s from './page.module.scss';
import { AllNewsDocument, DistrictBySubdomainDocument } from '@/graphql';
import { SectionHeader } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { pageSize } from '@/lib/constants';
import { notFound } from 'next/navigation';
import NewsLoader from '@/app/[subdomain]/aktuellt/NewsLoader';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/[subdomain]/layout';
import { DraftMode } from 'next-dato-utils/components';

export type Props = {
	news: NewsRecord[];
	district: DistrictRecord;
	pagination: {
		count: number;
	};
};

export default async function News({ params }: PageProps<'/[subdomain]/aktuellt'>) {
	const { subdomain } = await params;
	const { district } = await apiQuery(DistrictBySubdomainDocument, {
		variables: { subdomain },
		stripStega: true,
	});
	if (!district) return notFound();
	console.log(district);
	const { allNews, _allNewsMeta, draftUrl } = await apiQuery(AllNewsDocument, {
		variables: { districtId: district.id, first: pageSize, skip: 0 },
	});

	return (
		<>
			<SectionHeader title='Aktuellt' layout='news' />
			<article>
				<div className={s.container}>
					<NewsLoader
						allNews={allNews}
						district={district as DistrictRecord}
						count={_allNewsMeta.count}
					/>
				</div>
			</article>
			<DraftMode url={draftUrl} path={`/aktuellt`} />
		</>
	);
}

export async function generateMetadata({
	params,
}: PageProps<'/[subdomain]/aktuellt'>): Promise<Metadata> {
	const { subdomain } = await params;
	return await buildMetadata({
		title: 'Aktuellt',
		pathname: '/aktuellt',
		subdomain,
	});
}
