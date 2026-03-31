'use client';

import { isTenantHome, PRIMARY_SUBDOMAIN } from '@/lib/tenancy';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function PageColor({ district }: { district: DistrictRecord }) {
	const pathname = usePathname();

	function updatecolor() {
		const root = document.querySelector<HTMLElement>(':root');
		const isHome = isTenantHome(pathname);
		if (!root || !district) return;

		root.style.setProperty('--page-color', district.color.hex);
		root.style.setProperty('--background', isHome ? district?.color?.hex : 'var(--light-grey)');
	}

	useEffect(() => {
		updatecolor();
		setTimeout(updatecolor, 100);
	}, [pathname, district]);

	return null;
}
