import { DistrictBySubdomainDocument, DistrictDocument } from '@/graphql';
import { Aside, Article, NewsletterForm, SectionHeader } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/app/[subdomain]/layout';
import { Metadata } from 'next';
import { DraftMode } from 'next-dato-utils/components';

export default async function Contact({ params }: PageProps<'/[subdomain]/kontakt'>) {
	const { subdomain } = await params;
	const { district, draftUrl } = await apiQuery(DistrictBySubdomainDocument, {
		variables: { subdomain },
	});
	if (!district) return notFound();

	const { id, contentContact, intro, _seoMetaTags, _editingUrl } = district;

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
			<DraftMode url={draftUrl} path={`/kontakt`} />
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
