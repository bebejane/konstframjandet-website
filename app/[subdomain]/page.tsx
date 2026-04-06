import s from './page.module.scss';
import React from 'react';
import { AllDistrictsDocument, StartDocument } from '@/graphql';
import { StartSelectionContainer, StartSelectionCard, SectionHeader } from '@/components';
import Block from '@/components/content/Block';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';
import { PRIMARY_SUBDOMAIN } from '@/lib/tenancy';
import { DraftMode } from 'next-dato-utils/components';

export default async function Home({ params }: PageProps<'/[subdomain]'>) {
	const subdomain = (await params).subdomain ?? PRIMARY_SUBDOMAIN;
	const { allDistricts } = await apiQuery(AllDistrictsDocument, { stripStega: true });
	const district = allDistricts.find((d) => d.subdomain === subdomain);

	if (!district) return notFound();

	const {
		start,
		allNews,
		district: startDistrict,
		draftUrl,
	} = await apiQuery(StartDocument, {
		variables: { districtId: district.id },
	});
	const isMainDistrict = district?.subdomain === PRIMARY_SUBDOMAIN;

	const selectedInDistricts = (
		<StartSelectionContainer>
			{start?.selectedInDistricts.map((item, idx) => (
				<StartSelectionCard key={idx} item={item as NewsRecord} />
			))}
		</StartSelectionContainer>
	);
	console.log('hej3');
	console.log('\\');

	return (
		<>
			<SectionHeader layout='home' />
			<article>
				<div className={s.container}>
					{startDistrict?.content?.map((block, idx) =>
						block.__typename === 'StartSelectedDistrictNewsRecord' && isMainDistrict ? (
							<React.Fragment key={idx}>{selectedInDistricts}</React.Fragment>
						) : block.__typename === 'StartLatestNewsRecord' ? (
							<Block key={idx} data={{ ...block, news: allNews }} />
						) : (
							<Block key={idx} data={block} />
						),
					)}
					{!isMainDistrict && selectedInDistricts}
				</div>
			</article>
			<DraftMode url={draftUrl} path='/' />
		</>
	);
}
