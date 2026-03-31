'use client';

import { default as NextLink, LinkProps } from 'next/link';
import { HTMLProps, FC } from 'react';
import { useDistrict } from '@/lib/context/district';
import { getTenantUrl, PRIMARY_SUBDOMAIN } from '@/lib/tenancy';

export type LinkProperties = LinkProps &
	HTMLProps<HTMLAnchorElement> & {
		district?: DistrictRecord;
	};

const Link: FC<LinkProperties> = (props: LinkProperties) => {
	const { district: _district } = useDistrict();
	const district = props.district ?? _district;
	const href = getTenantUrl(district?.subdomain, props.href);
	return (
		<NextLink {...props} href={href}>
			{props.children}
		</NextLink>
	);
};

export default Link;
