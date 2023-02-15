import s from "./index.module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { GetStaticProps } from "next";
import { apiQuery } from "dato-nextjs-utils/api";
import type { Menu } from "/lib/menu";

export type Props = {
	regionStart: RegionRecord
	menu: Menu,
	region: RegionRecord
}

export default function Home({ }: Props) {

	return (
		<div className={s.container}>
			home
		</div>
	);
}

export const getStaticProps: GetStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

	return {
		props,
		revalidate
	}
})