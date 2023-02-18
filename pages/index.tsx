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
			<ul className={s.districts}>
				{districts.map(({ subdomain, name }, idx) =>
					<li key={idx}>
						{subdomain ?
							<a href={`https://${subdomain}.konstframjandet.se`}>
								{name}
							</a>
							:
							<>{name}</>
						}
						{idx !== districts.length - 1 && <>&nbsp;|&nbsp;</>}
					</li>
				)}
			</ul>
			<br />
			<b>{district?.name}</b>
			<ul>
				<li><Link href="/nyheter">Nyheter</Link></li>
				<li><Link href="/om">Om</Link></li>
				<li><Link href="/projekt">Projekt</Link></li>
				<li><Link href="/kontakt">Kontakt</Link></li>
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