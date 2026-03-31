'use client';

import s from './MenuMobile.module.scss';
import cn from 'classnames';
import { useState, useRef, useEffect } from 'react';
import { animateLogo } from '@/lib/utils';
import type { Menu } from '@/lib/menu';
import Link from '@/components/nav/Link';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { getTenantUrl, PRIMARY_SUBDOMAIN } from '@/lib/tenancy';

export type Props = {
	menu: Menu;
	district: DistrictRecord;
	districts: AllDistrictsQuery['allDistricts'];
};

export default function MenuMobile({ menu, district }: Props) {
	const pathname = usePathname();
	const isHome = pathname === '/';
	const isMainDistrict = district?.subdomain === PRIMARY_SUBDOMAIN;
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLElement | null>(null);
	const [subSelected, setSubSelected] = useState<string | null>(null);

	// Remove some sub items
	menu = menu.map((item) =>
		['about', 'district'].includes(item.type) ? item : { ...item, items: [] },
	);

	useEffect(() => {
		return () => {
			setOpen(false);
			animateLogo('logo-mobile');
		};
	}, [pathname]);

	useEffect(() => {
		const root = document.querySelector<HTMLElement>(':root');
		const color = open ? 'var(--black)' : district?.color?.hex;
		const bg = open ? 'var(--black)' : isHome ? district?.color?.hex : 'var(--light-grey)';
		if (!root) return;
		color && root.style.setProperty('--page-color', color);
		bg && root.style.setProperty('--background', bg);
	}, [open]);

	return (
		<>
			<header className={cn(s.navbar, open && s.open)}>
				<NextLink id='logo-mobile' href={'/'} className={s.logo}>
					A
				</NextLink>
				<h2>{isMainDistrict ? 'Konstfrämjandet' : `${district?.name}`}</h2>
				<div className={cn(s.hamburger, 'symbol')} onClick={() => setOpen(!open)}>
					{open ? '5' : '2'}
				</div>
				<div className={s.line}></div>
			</header>
			<div className={cn(s.menuMobile, open && s.open)}>
				<nav className={s.menu} ref={ref}>
					<ul>
						{menu
							.filter(({ type }) => !(type === 'district' && !isMainDistrict))
							.map(({ type, slug, label, items }) => (
								<li className={cn(s.active)} key={type}>
									{slug && !items?.length ? (
										<Link href={slug}>{label}</Link>
									) : (
										<>
											<span onClick={() => setSubSelected(type === subSelected ? null : type)}>
												{label}
											</span>
											<ul className={cn(type === subSelected && s.expanded)}>
												{items?.map(({ type, slug, label, subdomain }, idx) => {
													const href =
														type === 'district' ? getTenantUrl(district.subdomain, slug) : slug;
													return (
														<li key={idx}>{href && <NextLink href={href}>{label}</NextLink>}</li>
													);
												})}
											</ul>
										</>
									)}
								</li>
							))}
					</ul>
				</nav>
			</div>
		</>
	);
}
