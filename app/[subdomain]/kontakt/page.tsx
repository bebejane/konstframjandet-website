import { DistrictBySubdomainDocument, DistrictDocument } from '@/graphql';
import { Aside, Article, NewsletterForm, SectionHeader } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/app/[subdomain]/layout';
import { Metadata } from 'next';

export default async function Contact({ params }: PageProps<'/[subdomain]/kontakt'>) {
	const { subdomain } = await params;
	const { district } = await apiQuery(DistrictBySubdomainDocument, { variables: { subdomain } });
	if (!district) return notFound();
	const { id, contentContact, intro, _seoMetaTags } = district;

	return (
		<>
			<SectionHeader title={'Kontakta oss'} layout='contact' />
			<article>
				<Aside hideOnMobile={true} />
				<Article
					id={id}
					record={district}
					intro={intro}
					content={contentContact}
					seo={_seoMetaTags}
				/>
				<NewsletterForm />
			</article>
		</>
	);
}

export async function generateMetadata({
	params,
}: PageProps<'/[subdomain]/kontakt'>): Promise<Metadata> {
	const { subdomain } = await params;
	return await buildMetadata({
		title: 'Kontakta oss',
		pathname: `/kontakt`,
		subdomain,
	});
}
