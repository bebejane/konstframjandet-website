import '@/styles/index.scss';
import { Content, Footer, FullscreenGallery, Menu, MenuMobile } from '@/components';
import {  AllDistrictsDocument } from '@/graphql';
import { PageMeta, PageProvider } from '@/lib/context/page';
import { buildMenu } from '@/lib/menu';
import { primarySubdomain } from '@/lib/utils';
import { apiQuery } from 'next-dato-utils/api';

export default async function SubdomainLayout({ params, children }: LayoutProps<'/[subdomain]'>) {
  const subdomain =  (await params).subdomain
	const	page = {
				title: 'Hem',
				layout: 'home',
			} as PageMeta
	
	const { allDistricts, draftUrl } = await apiQuery(AllDistrictsDocument)
	const district = allDistricts.find(({ subdomain }) => subdomain === primarySubdomain) as DistrictRecord
	const districtId = district.id	
	const title = district.name
	const menu = await buildMenu(districtId)
	
	// useEffect(() => {

  //   const r = document.querySelector<HTMLElement>(':root')
  //   r.style.setProperty('--page-color', district?.color?.hex);
  //   r.style.setProperty('--background', isHome ? district?.color?.hex : 'var(--light-grey)');

  // }, [isHome, district])
console.log('layot')
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

export async function generateStaticParams() {
  const { allDistricts } = await apiQuery(AllDistrictsDocument)
  return allDistricts.map(({ subdomain }) => ({ subdomain }))
}