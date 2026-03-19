import s from "./page.module.scss";
import { AllDistrictsDocument, StartDocument } from '@/graphql';
import { StartSelectionContainer, StartSelectionCard } from "@/components";
import { Block } from '@/components'
import { PageMeta, usePage } from "@/lib/context/page";
import React from "react";
import { apiQuery } from "next-dato-utils/api";

export default async function Home({ }: PageProps<'/'>) {

	const { allDistricts, draftUrl } = await apiQuery(AllDistrictsDocument)
	const district = allDistricts[0] as DistrictRecord
	const districtId = district.id
	const title = district.name
	
	const { start, allNews} = await apiQuery(StartDocument, { variables: { districtId } })
	// const { isMainDistrict } = usePage()
	const isMainDistrict = true

	const selectedInDistricts = (
		<StartSelectionContainer>
			{start?.selectedInDistricts.map((item, idx) =>
				<StartSelectionCard key={idx} item={item} />
			)}
		</StartSelectionContainer>
	)

	return (
		<div className={s.container}>
			{district?.content?.map((block, idx) =>
					block.__typename === 'StartSelectedDistrictNewsRecord' && isMainDistrict ?
						<React.Fragment key={idx}>{selectedInDistricts}</React.Fragment>
						:
						block.__typename === 'StartLatestNewsRecord' ?
							<Block key={idx} data={{ ...block, news: allNews }} record={district} />
							:
							<Block key={idx} data={block} record={district} />
				)}

			{!isMainDistrict &&
				<>{selectedInDistricts}</>
			}
		</div>
	);
}