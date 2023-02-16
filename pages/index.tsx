import s from "./index.module.scss";
import cn from 'classnames'
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
			{district?.name}
			<div className={s.color} style={{ backgroundColor: district?.color.hex }}></div>
			<ul>
				<li><Link href="/nyheter">Nyheter</Link></li>
				<li><Link href="/om">Om</Link></li>
				<li><Link href="/projekt">Projekt</Link></li>
				<li><Link href="/kontakt">Kontakt</Link></li>
			</ul>
			<br />
			<h1>Alla distrikt</h1>
			<ul>
				{districts.map(({ subdomain, name }) =>
					<li>
						{subdomain ?
							<a href={`https://${subdomain}.konstframjandet.se`}>{name}</a>
							:
							<>{name}</>
						}
					</li>
				)}
			</ul>
		</div>
	);
}


export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

	return {
		props,
		revalidate
	}
})
/*
export const config = {
	runtime: 'experimental-edge'
}
*/