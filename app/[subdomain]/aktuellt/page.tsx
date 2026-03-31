import s from './page.module.scss';
import { AllNewsDocument, DistrictBySubdomainDocument } from '@/graphql';
import { Loader, NewsCard, NewsContainer, SectionHeader } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/[subdomain]/layout';
import { DraftMode, InfiniteScrollClient } from 'next-dato-utils/components';

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

	const variables = { districtId: district.id, first: 10 };
	const { allNews, draftUrl } = await apiQuery(AllNewsDocument, {
		variables,
	});

	return (
		<>
			<SectionHeader title='Aktuellt' layout='news' />
			<article>
				<div className={s.container}>
					<NewsContainer>
						<InfiniteScrollClient
							id='news'
							initial={allNews}
							query={AllNewsDocument}
							variables={variables}
							loader={Loader}
						>
							{NewsCard}
						</InfiniteScrollClient>
					</NewsContainer>
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
