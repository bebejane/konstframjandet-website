import { Content, Footer, FullscreenGallery, Menu, MenuMobile } from '@/components';
import { AllDistricsDocument, AllDistrictsDocument } from '@/graphql';
import { PageMeta, PageProvider } from '@/lib/context/page';
import { buildMenu } from '@/lib/menu';
import '@/styles/index.scss';
import { apiQuery } from 'next-dato-utils/api';

export default async function RootLayout({ children }: LayoutProps<'/'>) {

	const	page = {
				title: 'Hem',
				layout: 'home',
			} as PageMeta
	
	const { allDistricts, draftUrl } = await apiQuery(AllDistrictsDocument)
	const district = allDistricts[0] as DistrictRecord
	const districtId = district.id
	const title = district.name
	const menu = await buildMenu(districtId)
	
	// useEffect(() => {

  //   const r = document.querySelector<HTMLElement>(':root')
  //   r.style.setProperty('--page-color', district?.color?.hex);
  //   r.style.setProperty('--background', isHome ? district?.color?.hex : 'var(--light-grey)');

  // }, [isHome, district])

	return (
		<html lang='sv-SE'>
			<body id='root'>
				<PageProvider value={{ district, ...page, isHome:true }}>
					<Content menu={menu} title={title}>
						{children}
					</Content>
					<Menu districts={allDistricts} menu={menu} />
					<MenuMobile districts={allDistricts} menu={menu} />
					<Footer  menu={menu} districts={allDistricts} />
					{/* <FullscreenGallery
						key={imageId}
						index={images?.findIndex((image) => image?.id === imageId)}
						images={images as unknown[] as FileField[]}
						show={imageId !== undefined}
						onClose={() => setImageId(undefined)}
					/> */}
				</PageProvider>
			</body>
		</html>
	);
}
