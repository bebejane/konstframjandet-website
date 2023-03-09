import s from "./index.module.scss";
import districts from '/lib/districts.json'
import withGlobalProps from "/lib/withGlobalProps";
import type { Menu } from "/lib/menu";
import Link from "next/link";

export type Props = {
	menu: Menu,
	district: DistrictRecord
}

export default function Home({ menu, district }: Props) {
	return (
		<div className={s.container}>
			hem
		</div>
	);
}


export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

	return {
		props: {
			...props,
			page: {
				title: 'Hem',
				layout: 'home'
			}
		},
		revalidate
	}
})