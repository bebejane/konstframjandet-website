import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';

export interface StoreState {
	showMenu: boolean;
	showMenuMobile: boolean;
	showSearch: boolean;
	searchQuery: string | undefined;
	view: 'list' | 'full';
	images: ImageFileField[];
	imageId?: string | null;
	setShowMenu: (showMenu: boolean) => void;
	setShowMenuMobile: (showMenuMobile: boolean) => void;
	setImages: (images: ImageFileField[] | undefined) => void;
	setImageId: (imageId: string | null) => void;
	setShowSearch: (showSearch: boolean) => void;
	setSearchQuery: (searchQuery: string) => void;
	setView: (view: 'list' | 'full') => void;
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
			showMenu,
		})),
	setShowMenuMobile: (showMenuMobile: boolean) =>
		set((state) => ({
			showMenuMobile,
		})),
	setImageId: (imageId: string | null) =>
		set((state) => ({
			imageId,
		})),
	setImages: (images: ImageFileField[] | undefined) =>
		set((state) => ({
			images,
		})),
	setShowSearch: (showSearch: boolean) =>
		set((state) => ({
			showSearch,
		})),
	setSearchQuery: (searchQuery: string) =>
		set((state) => ({
			searchQuery,
		})),
	setView: (view: 'list' | 'full') =>
		set((state) => ({
			view,
		})),
}));

export default useStore;
export { useStore, useShallow };
