import '@/styles/index.scss';
import s from './layout.module.scss';
import { Footer, FullscreenGallery, Menu, MenuMobile } from '@/components';
import { AllDistrictsDocument } from '@/graphql';
import { buildMenu } from '@/lib/menu';
import { primarySubdomain } from '@/lib/utils';
import { apiQuery } from 'next-dato-utils/api';
import PageColor from '@/components/common/PageColor';
import { DistrictProvider } from '@/lib/context/district';
import { Provider as BalancerProvider } from 'react-wrap-balancer';

export default async function SubdomainLayout({ params, children }: LayoutProps<'/[subdomain]'>) {
	const subdomain = (await params).subdomain ?? primarySubdomain;
	const { allDistricts, draftUrl } = await apiQuery(AllDistrictsDocument);
	const district = allDistricts.find((d) => d.subdomain === subdomain) as DistrictRecord;
	const districtId = district.id;
	const menu = await buildMenu(districtId);

	return (
		<html lang='sv-SE'>
			<body id='root'>
				<DistrictProvider value={{ district }}>
					<BalancerProvider>
						<main id='content' className={s.layout}>
							{children}
						</main>
					</BalancerProvider>
					<Menu district={district} districts={allDistricts} menu={menu} />
					<MenuMobile district={district} districts={allDistricts} menu={menu} />
					<Footer district={district} menu={menu} districts={allDistricts} />
					<FullscreenGallery />
					<PageColor district={district} />
				</DistrictProvider>
			</body>
		</html>
	);
}

export async function generateStaticParams() {
	const { allDistricts } = await apiQuery(AllDistrictsDocument);
	return allDistricts.map(({ subdomain }) => ({ subdomain }));
}
