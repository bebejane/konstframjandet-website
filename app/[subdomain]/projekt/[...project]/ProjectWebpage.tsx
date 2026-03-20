'use client';

import s from './ProjectWebpage.module.scss';
import { Bubble } from '@/components';
import { usePage } from '@/lib/context/page';
import { useScrollInfo } from 'next-dato-utils/hooks';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export type ProjectWebpageProps = {
	href: string;
	children?: React.ReactNode;
	color?: string | null;
};

export function ProjectWebpage({ href, color: _color, children }: ProjectWebpageProps) {
	const pathname = usePathname();
	const { scrolledPosition, documentHeight, viewportHeight } = useScrollInfo();
	const [show, setShow] = useState(true);

	useEffect(() => {
		if (!_color) return;
		const root = document.querySelector<HTMLElement>(':root');
		setTimeout(() => {
			root?.style.setProperty('--page-color', _color);
		}, 30);
	}, [pathname, _color]);

	useEffect(() => {
		const footer = document.getElementById('footer');
		const { height } = footer?.getBoundingClientRect() ?? { height: 0 };
		const threshold = documentHeight - height - viewportHeight - 100;
		setShow(scrolledPosition < threshold);
	}, [scrolledPosition]);

	return (
		show && (
			<Bubble href={href} className={s.direct}>
				{children}
			</Bubble>
		)
	);
}
