import s from "./page.module.scss";
import { AllDistrictsDocument, StartDocument } from '@/graphql';
import { StartSelectionContainer, StartSelectionCard } from "@/components";
import { Block } from '@/components'
import { PageMeta, usePage } from "@/lib/context/page";
import React from "react";
import { apiQuery } from "next-dato-utils/api";
import { primarySubdomain } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function Home({ params }: PageProps<'/[subdomain]'>) {
	const subdomain =  (await params).subdomain ?? primarySubdomain
	const { allDistricts, draftUrl } = await apiQuery(AllDistrictsDocument)
	const district = allDistricts.find((d) => d.subdomain === subdomain)
	if(!district) return notFound()
	const isMainDistrict = district.subdomain === primarySubdomain
	const { start, allNews} = await apiQuery(StartDocument, { variables: { districtId:district.id } })
	// const { isMainDistrict } = usePage()
	
	console.log(district)

	const selectedInDistricts = (
		<StartSelectionContainer>
			{start?.selectedInDistricts.map((item, idx) =>
				<StartSelectionCard key={idx} item={item as NewsRecord} />
			)}
		</StartSelectionContainer>
	)

	return (
		<div className={s.container}>
			{start?.content?.map((block, idx) =>
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