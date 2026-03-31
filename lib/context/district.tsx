'use client';

import { useContext, createContext } from 'react';

export type DistrictProps = {
	district?: DistrictRecord;
};

const initialState: DistrictProps = {
	district: undefined,
};

export const PageContext = createContext(initialState);

export type DistrictProviderProps = {
	children: React.ReactNode | React.ReactNode[] | undefined;
	value: DistrictProps;
};

// Context provider
export const DistrictProvider = ({ children, value }: DistrictProviderProps) => {
	return (
		<PageContext.Provider
			value={{
				...initialState,
				...value,
			}}
		>
			{children}
		</PageContext.Provider>
	);
};
// usePage hook
export const useDistrict = (): DistrictProps => {
	return useContext(PageContext);
};
