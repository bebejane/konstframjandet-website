import { apiQuery } from 'next-dato-utils/api';
import { NewsDocument, AllNewsDocument, DistrictBySubdomainDocument } from '@/graphql';
import { Article, Aside, SectionHeader } from '@/components';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/[subdomain]/layout';
import { DraftMode } from 'next-dato-utils/components';

export type Props = {
	news: NewsRecord;
};

export default async function NewsItem({ params }: PageProps<'/[subdomain]/aktuellt/[news]'>) {
	const { news: slug, subdomain } = await params;
	const { district } = await apiQuery(DistrictBySubdomainDocument, {
		variables: { subdomain },
		stripStega: true,
	});
	if (!district) return notFound();
	const { news, draftUrl } = await apiQuery(NewsDocument, {
		variables: { slug, districtId: district.id },
	});
	if (!news) return notFound();

	const {
		id,
		title,
		intro,
		image,
		content,
		address,
		date,
		misc,
		externalLink,
		extra,
		time,
		where,
		subtitle,
		_seoMetaTags,
	} = news;

	const haveMeta = [where, address, date, time, misc].filter((el) => el).length > 0;

	return (
		<>
			<SectionHeader title={title} subtitle={subtitle} layout='full' />
			<article>
				<Aside title={'Var & när'} backLink={'/aktuellt'} backLinkType={'aktuellt'}>
					{haveMeta && (
						<>
							<p>
								{where && (
									<>
										{where}
										<br />
									</>
								)}
								{address && (
									<>
										{address}
										<br />
									</>
								)}
								{date && (
									<>
										{date}
										<br />
									</>
								)}
								{time && (
									<>
										{time}
										<br />
									</>
								)}
								{misc && (
									<>
										{misc}
										<br />
									</>
								)}
								{externalLink && (
									<>
										<a href={externalLink}>Extern länk</a>
										<br />
									</>
								)}
							</p>
						</>
					)}
				</Aside>
				<Article
					id={id}
					record={news}
					subtitle={subtitle}
					image={image as ImageFileField}
					intro={intro}
					content={content}
					extraContent={extra}
					date={date}
					seo={_seoMetaTags}
					backLink={'/aktuellt'}
				/>
			</article>
			<DraftMode url={draftUrl} path={`/aktuellt/${slug}`} />
		</>
	);
}

export async function generateStaticParams({
	params,
}: PageProps<'/[subdomain]/aktuellt/[news]'>): Promise<{ news: string }[]> {
	const { subdomain } = await params;
	const { district } = await apiQuery(DistrictBySubdomainDocument, { variables: { subdomain } });
	const { allNews } = await apiQuery(AllNewsDocument, {
		all: true,
		variables: { districtId: district?.id },
	});
	return allNews.map(({ slug: news }) => ({ news }));
}

export async function generateMetadata({
	params,
}: PageProps<'/[subdomain]/aktuellt/[news]'>): Promise<Metadata> {
	const { subdomain, news: slug } = await params;
	const { district } = await apiQuery(DistrictBySubdomainDocument, { variables: { subdomain } });
	const { news } = await apiQuery(NewsDocument, { variables: { slug, districtId: district?.id } });
	return await buildMetadata({
		title: news?.title,
		pathname: `/aktuellt/${slug}`,
		subdomain,
		image: news?.image as FileField,
	});
}
