import { apiQuery } from 'next-dato-utils/api';
import { AboutDocument, AllAboutsDocument, DistrictBySubdomainDocument } from '@/graphql';
import { Aside, Article, SideMenu } from '@/components';
import { notFound } from 'next/navigation';

export default async function About({ params }: PageProps<'/[subdomain]/om/[about]'>) {
	const { about: slug, subdomain } = await params;
	const { district } = await apiQuery(DistrictBySubdomainDocument, { variables: { subdomain } });
	const { about } = await apiQuery(AboutDocument, {
		variables: { slug, districtId: district?.id },
	});

	if (!about) return notFound();
	const { id, content, intro, _seoMetaTags } = about;
	const { allAbouts } = await apiQuery(AllAboutsDocument, {
		variables: { districtId: district?.id },
	});

	return (
		<>
			<Aside hideOnMobile={true}>
				<SideMenu
					items={allAbouts.map(({ id, slug, title }) => ({ id, title, slug: `/om/${slug}` }))}
				/>
			</Aside>
			<Article id={id} intro={intro} content={content} record={about} seo={_seoMetaTags} />
		</>
	);
}

export async function generateStaticParams({ params }: PageProps<'/[subdomain]/om/[about]'>) {
	const { subdomain } = await params;
	const { district } = await apiQuery(DistrictBySubdomainDocument, { variables: { subdomain } });
	const { allAbouts } = await apiQuery(AllAboutsDocument, {
		all: true,
		variables: { districtId: district?.id },
	});
	return allAbouts.map(({ slug: about }) => ({ about }));
}
