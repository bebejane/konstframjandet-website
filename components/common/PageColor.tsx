'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function PageColor({ district }: { district: DistrictRecord }) {
	const pathname = usePathname();

	useEffect(() => {
		const root = document.querySelector<HTMLElement>(':root');

		if (!root || !district) return;
		root.style.setProperty('--page-color', district.color.hex);
		root.style.setProperty(
			'--background',
			pathname === '/' ? district?.color?.hex : 'var(--light-grey)',
		);
	}, [pathname, district]);

	return null;
}
