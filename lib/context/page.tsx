'use client';

import { useContext, createContext } from 'react';
import { PRIMARY_SUBDOMAIN } from '@/lib/utils';

export type PageMeta = {
	district?: DistrictRecord;
	title?: string;
	subtitle?: string;
	image?: FileField;
	intro?: string;
	color?: string;
	colorOption?: string;
	layout: 'full' | 'project' | 'home' | 'news';
	isHome: boolean;
	isMainDistrict: boolean;
};

const initialState: PageMeta = {
	district: undefined,
	title: undefined,
	subtitle: undefined,
	color: undefined,
	colorOption: undefined,
	layout: 'full',
	isHome: true,
	isMainDistrict: true,
};

export const PageContext = createContext(initialState);

export type PageProviderProps = {
	children: React.ReactNode | React.ReactNode[] | undefined;
	value: PageMeta;
};

// Context provider
export const PageProvider = ({ children, value }: PageProviderProps) => {
	return (
		<PageContext.Provider
			value={{
				...initialState,
				...value,
				layout: value.layout || initialState.layout,
				isMainDistrict: value?.district?.subdomain === PRIMARY_SUBDOMAIN,
			}}
		>
			{children}
		</PageContext.Provider>
	);
};
// usePage hook
export const usePage = (): PageMeta => {
	return useContext(PageContext);
};
