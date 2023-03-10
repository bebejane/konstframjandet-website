import { useContext, createContext } from "react";

const initialState: PageProps = {
  district: undefined,
  title: undefined,
  layout: 'full',
  isHome: true
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
      layout: value.layout || initialState.layout
    }}>
      {children}
    </PageContext.Provider>
  )
};
// usePage hook
export const usePage = (): PageProps => {
  return useContext(PageContext)
}
