import s from './[news].module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { NewsDocument, AllNewsDocument, DistrictBySubdomainDocument } from '@/graphql';
import { Article, Aside } from '@/components';
import { mainDistrict } from '@/lib/utils';
import { notFound } from 'next/navigation';

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
				title={title}
				subtitle={subtitle}
				image={image}
				intro={intro}
				content={content}
				extraContent={extra}
				date={date}
				seo={_seoMetaTags}
				backLink={'/aktuellt'}
			/>
		</>
	);
}

export async function generateStaticParams() {
	const { id: districtId } = await mainDistrict();
	const { allNews } = await apiQuery(AllNewsDocument, { all: true, variables: { districtId } });
	return allNews.map(({ slug: news }) => ({ news }));
}
