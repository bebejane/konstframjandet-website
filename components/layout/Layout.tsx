import s from './Layout.module.scss'
import React, { useState } from 'react'
import { Content, Footer, Grid, Menu, FullscreenGallery, MenuMobile } from '/components'
import type { MenuItem } from '/lib/menu'
import { useRouter } from 'next/router'
import { useStore } from '/lib/store'
import { usePage } from '/lib/context/page'


export type LayoutProps = {
	children: React.ReactNode,
	menu: MenuItem[],
	footer: any
	title: string
	districts: DistrictRecord[]
}

export default function Layout({ children, menu: menuFromProps, footer, title, districts }: LayoutProps) {

	const [menu, setMenu] = useState(menuFromProps)
	const [images, imageId, setImageId] = useStore((state) => [state.images, state.imageId, state.setImageId, state.searchQuery])

	return (
		<>
			<Content menu={menu} title={title}>
				{children}
			</Content>
			<Menu districts={districts} menu={menu} />
			<MenuMobile districts={districts} menu={menu} />
			<Footer footer={footer} menu={menu} districts={districts} />
			<FullscreenGallery
				index={images?.findIndex((image) => image?.id === imageId)}
				images={images}
				show={imageId !== undefined}
				onClose={() => setImageId(undefined)}
			/>
			<Grid />
		</>
	)
}