import create from "zustand";

export interface StoreState {
  showMenu: boolean
  showMenuMobile: boolean
  showSearch: boolean
  searchQuery: string | undefined
  view: 'list' | 'full'
  images: FileField[]
  imageId: string
  setShowMenu: (showMenu: boolean) => void
  setShowMenuMobile: (showMenuMobile: boolean) => void
  setImages: (images: FileField[] | undefined) => void
  setImageId: (imageId: string | undefined) => void
  setShowSearch: (showSearch: boolean) => void
  setSearchQuery: (searchQuery: string) => void
  setView: (view: 'list' | 'full') => void
}

const useStore = create<StoreState>((set) => ({
  showMenu: false,
  showMenuMobile: false,
  showSearch: false,
  searchQuery: undefined,
  view: 'full',
  images: [],
  imageId: undefined,
  setShowMenu: (showMenu: boolean) =>
    set((state) => ({
      showMenu
    })
    ),
  setShowMenuMobile: (showMenuMobile: boolean) =>
    set((state) => ({
      showMenuMobile
    })
    ),
  setImageId: (imageId: string | undefined) =>
    set((state) => ({
      imageId
    })
    ),
  setImages: (images: FileField[] | undefined) =>
    set((state) => ({
      images
    })
    ),
  setShowSearch: (showSearch: boolean) =>
    set((state) => ({
      showSearch
    })
    ),
  setSearchQuery: (searchQuery: string) =>
    set((state) => ({
      searchQuery
    })
    ),
  setView: (view: 'list' | 'full') =>
    set((state) => ({
      view
    })
    )
}));

export default useStore;
export { useStore };
