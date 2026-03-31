'use client';

import { default as NextLink, LinkProps } from 'next/link';
import { HTMLProps, FC } from 'react';
import { useDistrict } from '@/lib/context/district';
import { PRIMARY_SUBDOMAIN } from '@/lib/tenancy';

export type LinkProperties = LinkProps &
	HTMLProps<HTMLAnchorElement> & {
		district?: DistrictRecord;
	};

const Link: FC<LinkProperties> = (props: LinkProperties) => {
	const isdev = process.env.NODE_ENV === 'development';
	const { district: _district } = useDistrict();
	const district = props.district ?? (_district as DistrictRecord);
	const subdomain =
		isdev && district?.subdomain !== PRIMARY_SUBDOMAIN ? `/${district?.subdomain}` : '';
	const href = `${subdomain}${props.href}`;
	return (
		<NextLink {...props} href={href}>
			{props.children}
		</NextLink>
	);
};

export default Link;
