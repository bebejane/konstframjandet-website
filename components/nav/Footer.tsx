import s from './Footer.module.scss';
import cn from 'classnames';
import type { Menu } from '@/lib/menu';
import Link from '@/components/nav/Link';
import NextLink from 'next/link';
import { getTenantUrl, PRIMARY_SUBDOMAIN } from '@/lib/tenancy';

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
						.map(({ type, label, slug, items, href, subdomain }, idx) => (
							<li key={idx} className={cn(isMainDistrict && type === 'district' && s.double)}>
								{slug ? (
									<Link href={slug}>{label}</Link>
								) : href ? (
									<a href={href}>{label}</a>
								) : (
									<>{label}</>
								)}
								<ul>
									{items?.map(({ type, label, slug, href, subdomain }, idx) => (
										<li key={`${idx}-sub`}>
											{href ? (
												<a href={href}>{label}</a>
											) : (
												<Link
													scroll={true}
													href={type === 'district' ? getTenantUrl(subdomain, slug) : (slug ?? '')}
												>
													{label}
												</Link>
											)}
										</li>
									))}
								</ul>
							</li>
						))}
					<li className={s.aboutDesktop}>
						<NextLink href={'https://www.konstframjandet.se'} scroll={true}>
							Konstfrämjandet
						</NextLink>
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
