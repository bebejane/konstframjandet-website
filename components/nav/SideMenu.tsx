'use client';

import s from './SideMenu.module.scss';
import cn from 'classnames';
import Link from '@/components/nav/Link';
import { usePathname } from 'next/navigation';

export type Props = {
	items: {
		id: string;
		slug: string;
		title: string;
	}[];
};

export default function SideMenu({ items }: Props) {
	const pathname = usePathname();

	if (!items || !items.length) return null;

	return (
		<ul className={s.sidemenu}>
			{items.map(({ id, slug, title }) => (
				<li key={id} className={cn(slug === pathname && s.selected)}>
					<Link href={slug}>{title}</Link>
				</li>
			))}
		</ul>
	);
}
