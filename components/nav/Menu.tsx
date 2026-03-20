'use client';

import s from './Menu.module.scss';
import cn from 'classnames';
import { useState, useRef, useEffect } from 'react';
import { animateLogo } from '@/lib/utils';
import { useScrollInfo } from 'next-dato-utils/hooks';
import { SearchResult } from '@/components';
import type { Menu } from '@/lib/menu';
import Link from '@/components/nav/Link';
import NextLink from 'next/link';
import { useOnClickOutside } from 'usehooks-ts';
import { usePathname } from 'next/navigation';
import { PRIMARY_SUBDOMAIN } from '@/lib/tenancy';

export type MenuProps = {
	district: DistrictRecord;
	menu: Menu;
	districts: AllDistrictsQuery['allDistricts'];
};

export default function Menu({ district, districts, menu }: MenuProps) {
	const ref = useRef<HTMLElement | null>(null);
	const searchRef = useRef<HTMLInputElement | null>(null);
	const searchBarRef = useRef<HTMLDivElement | null>(null);
	const districtsPopupRef = useRef<HTMLDivElement | null>(null);
	const pathname = usePathname();
	const isHome = pathname === '/';
	const isMainDistrict = district?.subdomain === PRIMARY_SUBDOMAIN;
	const { scrolledPosition } = useScrollInfo();
	const [offset, setOffset] = useState(0);
	const [ratio, setRatio] = useState(0);
	const [districtHover, setDistrictHover] = useState<string | undefined>();
	const [showDistricts, setShowDistricts] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const [query, setQuery] = useState('');
	const [logoStyle, setLogoStyle] = useState<React.CSSProperties>();
	const [navStyle, setNavStyle] = useState<React.CSSProperties>();
	const [searchStyle, setSearchStyle] = useState<React.CSSProperties>();
	const [resultsStyle, setResultsStyle] = useState<React.CSSProperties>();

	useOnClickOutside(searchBarRef as any, () => setShowSearch(false));
	useOnClickOutside(districtsPopupRef as any, () =>
		setTimeout(() => showDistricts && setShowDistricts(false), 10),
	);

	function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setQuery(searchRef.current?.value ?? '');
	}

	const resetSearch = () => {
		setQuery('');
		setShowSearch(false);
	};

	useEffect(() => {
		if (!ref.current) return;
		setOffset(parseInt(getComputedStyle(ref.current).paddingTop));
	}, [ref]);

	useEffect(
		() => setRatio(Math.min(1, (scrolledPosition || 0) / offset) || 0),
		[scrolledPosition, offset],
	);

	useEffect(() => {
		const scrollY = Math.min(offset, scrolledPosition);
		setLogoStyle({
			fontSize: `calc(${Math.max(0.8, 1 - ratio)} * var(--navbar-height) + calc(-1 * var(--navbar-space)))`,
		});
		setNavStyle({
			transform: `translateY(-${scrollY}px)`,
			backgroundColor: scrollY > 0 ? 'var(--background)' : undefined,
		});
		setSearchStyle({ minHeight: `calc(var(--navbar-height) - ${scrollY}px)` });
		setResultsStyle({
			minHeight: `calc(100vh - var(--navbar-height) + ${scrollY}px)`,
			maxHeight: `calc(100vh - var(--navbar-height) + ${scrollY}px)`,
		});
	}, [scrolledPosition, offset, ratio]);

	useEffect(() => {
		return () => {
			setShowDistricts(false);
			animateLogo('logo');
			resetSearch();
		};
	}, [pathname]);

	useEffect(() => {
		if (!searchRef.current) return;
		searchRef.current[showSearch ? 'focus' : 'blur']();
		searchRef.current.value = '';
		setQuery('');
	}, [searchRef, showSearch]);

	if (!district) return null;

	const { subdomain } = district;

	return (
		<>
			<div className={cn(s.logo, isHome && s.home)}>
				<NextLink id='logo' href={'/'} style={logoStyle}>
					A
				</NextLink>
			</div>
			<nav className={cn(s.menu, isHome && s.home)} style={navStyle} ref={ref}>
				<div className={s.top} style={{ opacity: 1 - ratio }}>
					<h2>Konstfrämjandet{!isMainDistrict && ` ${district.name}`}</h2>
					<div className='small'>
						{isMainDistrict ? (
							<>
								{district.facebook && <a href={district.facebook}>Facebook</a>}
								{district.instagram && <a href={district.instagram}>Instagram</a>}
								<Link href='/om/english'>English</Link>
							</>
						) : (
							<>
								<a className='symbol' href={district.facebook ?? ''}>
									7
								</a>
								<a className='symbol' href={district.instagram ?? ''}>
									8
								</a>
								{district.englishShortcut && <Link href='/om/english'>English</Link>}
								<Link
									href={
										process.env.NODE_ENV === 'production' ? 'https://www.konstframjandet.se' : '/'
									}
								>
									Till Konstfrämjandet.se
								</Link>
							</>
						)}
					</div>
				</div>
				<div className={s.wrapper}>
					<ul>
						{menu.map(({ type, slug, label }, idx) => {
							const rootSlug = slug?.split('/')[1] ?? '';
							const active =
								(pathname.startsWith(`/${rootSlug}`) ||
									pathname.startsWith(`/${district.subdomain}/${rootSlug}`)) &&
								slug !== '/';

							return type !== 'district' ? (
								<li key={idx} className={cn(active && !showDistricts && s.active)}>
									{slug ? <Link href={slug}>{label}</Link> : <>{label}</>}
								</li>
							) : (
								isMainDistrict && (
									<li
										key={idx}
										className={cn(showDistricts && s.active)}
										onClick={() => setShowDistricts(!showDistricts)}
									>
										Distrikt
									</li>
								)
							);
						})}
					</ul>
					<span className={'mid'} onClick={() => setShowSearch(true)}>
						Sök
					</span>
				</div>
			</nav>

			<nav
				ref={districtsPopupRef}
				className={cn(s.districts, showDistricts && s.show)}
				style={{ ...navStyle, backgroundColor: 'var(--white)' }}
			>
				<span className='mid'>Besök våra distrikt</span>
				<ul>
					{districts
						?.filter((d) => PRIMARY_SUBDOMAIN !== d.subdomain)
						.map((d) => (
							<li key={d.id}>
								<NextLink
									href={`/${d.subdomain}`}
									onMouseEnter={() => setDistrictHover(d.id)}
									onMouseLeave={() => setDistrictHover(undefined)}
									style={{ color: districtHover === d.id ? d.color.hex : 'unset' }}
								>
									{d.name}
								</NextLink>
							</li>
						))}
				</ul>
			</nav>

			<div ref={searchBarRef} className={cn(s.search, showSearch && s.show)} style={searchStyle}>
				<div className={s.bar} style={searchStyle}>
					<form onSubmit={handleSearchSubmit}>
						<input className={'mid'} placeholder={'Sök...'} ref={searchRef} />
					</form>
				</div>
				<div className={s.results} style={query ? resultsStyle : {}}>
					<SearchResult query={query} district={district} />
				</div>
				<span className={cn(s.close, 'small')} onClick={resetSearch}>
					Stäng
				</span>
			</div>
		</>
	);
}
