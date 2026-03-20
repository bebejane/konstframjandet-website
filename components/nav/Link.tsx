'use client';

import { default as NextLink, LinkProps } from 'next/link';
import { HTMLProps, FC } from 'react';
import { primarySubdomain } from '@/lib/utils';
import { useDistrict } from '@/lib/context/district';

export type LinkProperties = LinkProps & HTMLProps<HTMLAnchorElement>;

const Link: FC<LinkProperties> = (props: LinkProperties) => {
	const isdev = process.env.NODE_ENV === 'development';
	const { district } = useDistrict();
	const subdomain =
		isdev && district?.subdomain !== primarySubdomain ? `/${district?.subdomain}` : '';
	const href = `${subdomain}${props.href}`;
	return (
		<NextLink {...props} href={href}>
			{props.children}
		</NextLink>
	);
};

export default Link;
