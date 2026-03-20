import s from './[news].module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { NewsDocument, AllNewsDocument, DistrictBySubdomainDocument } from '@/graphql';
import { Article, Aside, SectionHeader } from '@/components';
import { mainDistrict } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/[subdomain]/layout';

export type Props = {
	news: NewsRecord;
};

export default async function NewsItem({ params }: PageProps<'/[subdomain]/aktuellt/[news]'>) {
	const { news: slug, subdomain } = await params;
	const { district } = await apiQuery(DistrictBySubdomainDocument, { variables: { subdomain } });
	if (!district) return notFound();
	const { news } = await apiQuery(NewsDocument, { variables: { slug, districtId: district.id } });
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
			<SectionHeader title={title} subtitle={subtitle} layout='news' />
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
		</>
	);
}

export async function generateStaticParams() {
	const { id: districtId } = await mainDistrict();
	const { allNews } = await apiQuery(AllNewsDocument, { all: true, variables: { districtId } });
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
