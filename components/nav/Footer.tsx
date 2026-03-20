import s from './Footer.module.scss';
import cn from 'classnames';
import type { Menu } from '@/lib/menu';
import Link from '@/components/nav/Link';
import { PRIMARY_SUBDOMAIN } from '@/lib/tenancy';

export type FooterProps = {
	menu: Menu;
	district: DistrictRecord;
	districts: AllDistrictsQuery['allDistricts'];
};

export default function Footer({ menu, district }: FooterProps) {
	const isMainDistrict = district.subdomain === PRIMARY_SUBDOMAIN;
	return (
		<footer className={s.footer} id='footer'>
			<div className={s.line}></div>
			<nav>
				<div className={s.about}>
					<Link href={'/'} scroll={true}>
						<span className={s.logo}>B</span>
					</Link>
					<div className={s.mobile}>
						<Link href={'/'} scroll={true}>
							Konstfrämjandet
						</Link>
						<br />
						<br />
						Konstfrämjandet är en organisation bildad 1947 som arbetar med konstbildning och med att
						föra ut konst till människor i deras vardag. Vi verkar i hela Sverige.
					</div>
				</div>
				<ul>
					{menu
						.filter(({ type }) => type === 'contact' || type === 'about')
						.map(({ type, label, slug, items, subdomain }, idx) => (
							<li key={idx} className={cn(isMainDistrict && type === 'district' && s.double)}>
								{slug ? <Link href={slug}>{label}</Link> : <>{label}</>}
								<ul>
									{items?.map(({ type, label, slug, subdomain }, idx) => (
										<li key={`${idx}-sub`}>
											<Link
												scroll={true}
												href={
													type === 'district' && process.env.NODE_ENV === 'production'
														? `https://${subdomain}.konstframjandet.se`
														: (slug ?? '')
												}
											>
												{label}
											</Link>
										</li>
									))}
								</ul>
							</li>
						))}
					<li>
						<Link href={'/'} scroll={true}>
							Konstfrämjandet
						</Link>
						<br />
						<br />
						Konstfrämjandet är en organisation bildad 1947 som arbetar med konstbildning och med att
						föra ut konst till människor i deras vardag. Vi verkar i hela Sverige.
					</li>
				</ul>
			</nav>
		</footer>
	);
}
