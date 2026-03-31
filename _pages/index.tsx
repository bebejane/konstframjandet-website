import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { StartDocument } from "/graphql";
import { StartSelectionContainer, StartSelectionCard } from "/components";
import { Block } from '/components'
import { usePage } from "/lib/context/page";
import React from "react";

export type Props = {
	district: DistrictRecord
	start: StartRecord
	latestNews: NewsRecord[]
}

export default function Home({ district, start, latestNews }: Props) {
	const { isMainDistrict } = usePage()

	const selectedInDistricts = (
		<StartSelectionContainer>
			{start.selectedInDistricts.map((item, idx) =>
				<StartSelectionCard key={idx} item={item} />
			)}
		</StartSelectionContainer>
	)

	return (
		<div className={s.container}>
			{district.content
				.map((block, idx) =>
					block.__typename === 'StartSelectedDistrictNewsRecord' && isMainDistrict ?
						<React.Fragment key={idx}>{selectedInDistricts}</React.Fragment>
						:
						block.__typename === 'StartLatestNewsRecord' ?
							<Block key={idx} data={{ ...block, news: latestNews }} record={district} />
							:
							<Block key={idx} data={block} record={district} />
				)}

			{!isMainDistrict &&
				<>{selectedInDistricts}</>
			}
		</div>
	);
}


export const getStaticProps = withGlobalProps({ queries: [StartDocument] }, async ({ props, revalidate, context }: any) => {

	return {
		props: {
			...props,
			page: {
				title: 'Hem',
				layout: 'home',
			} as PageProps
		},
		revalidate
	}
})