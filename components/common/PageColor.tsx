'use client';

import { PRIMARY_SUBDOMAIN } from '@/lib/tenancy';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function PageColor({ district }: { district: DistrictRecord }) {
	const pathname = usePathname();

	useEffect(() => {
		const root = document.querySelector<HTMLElement>(':root');
		const path =
			process.env.NODE_ENV === 'development' && pathname === `/${district.subdomain}`
				? '/'
				: pathname;
		const isHome = path === '/';
		if (!root || !district) return;

		root.style.setProperty('--page-color', district.color.hex);
		root.style.setProperty(
			'--background',
			path === '/' ? district?.color?.hex : 'var(--light-grey)',
		);
	}, [pathname, district]);

	return null;
}
