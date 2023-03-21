import { useContext, createContext } from "react";
import { primarySubdomain } from "/lib/utils";

const initialState: PageProps = {
  district: undefined,
  title: undefined,
  subtitle: undefined,
  color: undefined,
  colorOption: undefined,
  layout: 'full',
  isHome: true,
  isMainDistrict: true
}

export const PageContext = createContext(initialState);

export type PageProviderProps = {
  children: React.ReactElement,
  value: PageProps
}

// Context provider
export const PageProvider = ({ children, value }: PageProviderProps) => {

  return (
    <PageContext.Provider value={{
      ...initialState,
      ...value,
      layout: value.layout || initialState.layout,
      isMainDistrict: value?.district?.subdomain === primarySubdomain
    }}>
      {children}
    </PageContext.Provider>
  )
};
// usePage hook
export const usePage = (): PageProps => {
  return useContext(PageContext)
}
