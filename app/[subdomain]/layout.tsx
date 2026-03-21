import '@/styles/index.scss';
import 'swiper/css';
import s from './layout.module.scss';
import { Footer, FullscreenGallery, Menu, MenuMobile } from '@/components';
import { AllDistrictsDocument, SiteDocument } from '@/graphql';
import { buildMenu } from '@/lib/menu';
import { apiQuery } from 'next-dato-utils/api';
import PageColor from '@/components/common/PageColor';
import { DistrictProvider } from '@/lib/context/district';
import { Metadata } from 'next';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import { getTenantUrl, PRIMARY_SUBDOMAIN } from '@/lib/tenancy';
import { notFound } from 'next/navigation';

export default async function SubdomainLayout({ params, children }: LayoutProps<'/[subdomain]'>) {
	const subdomain = (await params).subdomain ?? PRIMARY_SUBDOMAIN;
	const { allDistricts, draftUrl } = await apiQuery(AllDistrictsDocument);
	const district = allDistricts.find((d) => d.subdomain === subdomain) as DistrictRecord;
	console.log('subdomain', subdomain);
	if (!district) return notFound();
	const districtId = district.id;
	const menu = await buildMenu(districtId);

	return (
		<html lang='sv-SE'>
			<body id='root'>
				<DistrictProvider value={{ district }}>
					<main id='content' className={s.layout}>
						{children}
					</main>
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

export async function generateMetadata(props: LayoutProps<'/'>): Promise<Metadata> {
	const {
		_site: { globalSeo, faviconMetaTags },
	} = await apiQuery(SiteDocument);

	const siteName = globalSeo?.siteName ?? '';

	return {
		metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
		icons: faviconMetaTags.map(({ attributes: { rel, sizes, type, href: url } }) => ({
			rel,
			url,
			sizes,
			type,
		})) as Icon[],
		...(await buildMetadata({
			title: {
				template: `${siteName} — %s`,
				default: siteName ?? '',
			},
			description: globalSeo?.fallbackSeo?.description?.substring(0, 157),
			image: globalSeo?.fallbackSeo?.image as FileField,
			pathname: '/',
			subdomain: PRIMARY_SUBDOMAIN,
		})),
	};
}

export type BuildMetadataProps = {
	title?: string | any;
	description?: string | null | undefined;
	pathname: string;
	subdomain: string;
	image?: FileField | null | undefined;
};

export async function buildMetadata({
	title,
	description,
	pathname,
	subdomain,
	image,
}: BuildMetadataProps): Promise<Metadata> {
	description = !description
		? ''
		: description.length > 160
			? `${description.substring(0, 157)}...`
			: description;

	const url = getTenantUrl(subdomain, pathname);

	return {
		title,
		alternates: {
			canonical: url,
		},
		description,
		openGraph: {
			title: title,
			description,
			url,
			images: [
				{
					url: `${image?.url}?w=1200&h=630&fit=fill&q=80`,
					width: 800,
					height: 600,
					alt: title,
				},
				{
					url: `${image?.url}?w=1600&h=800&fit=fill&q=80`,
					width: 1600,
					height: 800,
					alt: title,
				},
				{
					url: `${image?.url}?w=790&h=627&fit=crop&q=80`,
					width: 790,
					height: 627,
					alt: title,
				},
			],
			locale: 'sv_SE',
			type: 'website',
		},
	};
}
