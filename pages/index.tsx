import s from "./index.module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { GetStaticProps } from "next";
import { apiQuery } from "dato-nextjs-utils/api";
import type { Menu } from "/lib/menu";
import Link from "next/link";

export type Props = {
	menu: Menu,
}

export default function Home({ menu }: Props) {

	return (
		<div className={s.container}>

			<ul>
				<li><Link href="/nyheter">Nyheter</Link></li>
				<li><Link href="/om">Om</Link></li>
				<li><Link href="/projekt">Projekt</Link></li>
				<li><Link href="/kontakt">Kontakt</Link></li>
			</ul>
		</div>
	);
}

export const getStaticProps: GetStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

	return {
		props,
		revalidate
	}
})