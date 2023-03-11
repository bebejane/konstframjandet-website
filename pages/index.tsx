import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { StartDocument } from "/graphql";
import { StartSelectionContainer, StartSelectionCard } from "/components";
import { Block } from '/components'

export type Props = {
	district: DistrictRecord
	start: StartRecord
}

export default function Home({ district, start }: Props) {

	return (
		<div className={s.container}>
			{district.content.map((block, idx) =>
				<Block key={idx} data={block} record={district} />
			)}
			<StartSelectionContainer>
				{start.selectedInDistricts.map(item =>
					<StartSelectionCard item={item} />
				)}
			</StartSelectionContainer>
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