import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { StartDocument } from "/graphql";
import { StartSelectionContainer, StartSelectionCard } from "/components";
import { Block } from '/components'
import { usePage } from "/lib/context/page";

export type Props = {
	district: DistrictRecord
	start: StartRecord
}

export default function Home({ district, start }: Props) {

	const { isMainDistrict } = usePage()

	return (
		<div className={s.container}>
			{district.content
				.map((block, idx) =>
					//@ts-ignore
					block.__typename === 'StartSelectedDistrictNewsRecord' ?
						isMainDistrict &&
						<StartSelectionContainer>
							{start.selectedInDistricts.map((item, idx) =>
								<StartSelectionCard key={idx} item={item} />
							)}
						</StartSelectionContainer>
						:
						<Block key={idx} data={block} record={district} />
				)}

			{!isMainDistrict &&
				<StartSelectionContainer>
					{start.selectedInDistricts.map((item, idx) =>
						<StartSelectionCard key={idx} item={item} />
					)}
				</StartSelectionContainer>
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