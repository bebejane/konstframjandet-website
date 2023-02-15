import s from "./index.module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { GetServerSideProps } from "next";
import { apiQuery } from "dato-nextjs-utils/api";
import type { Menu } from "/lib/menu";
import Link from "next/link";

export type Props = {
	menu: Menu,
	district: DistrictRecord
}

export default function Home({ menu, district }: Props) {
	console.log(district)
	return (
		<div className={s.container}>
			District: {district?.name}
			<ul>
				<li><Link href="/nyheter">Nyheter</Link></li>
				<li><Link href="/om">Om</Link></li>
				<li><Link href="/projekt">Projekt</Link></li>
				<li><Link href="/kontakt">Kontakt</Link></li>
			</ul>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

	return {
		props
	}
})

export const config = {
	runtime: 'experimental-edge'
}