import { apiQuery } from 'dato-nextjs-utils/api';
import { MenuDocument } from "/graphql";
import { primarySubdomain } from '/lib/utils';

export type Menu = MenuItem[]

export type MenuItem = {
  type: string
  label: string
  slug?: string
  subdomain?: string
  items?: MenuItem[]
}

const base: Menu = [
  { type: 'home', label: 'Hem', slug: '/', items: [] },
  { type: 'news', label: 'Aktuellt', slug: '/aktuellt', items: [] },
  { type: 'project', label: 'Projekt', slug: '/projekt', items: [] },
  { type: 'district', label: 'Distrikt', items: [] },
  { type: 'about', label: 'Om', slug: '/om', items: [] },
  { type: 'contact', label: 'Kontakt', slug: '/kontakt', items: [] },
]

export const buildMenu = async (districtId: string) => {

  const {
    news,
    abouts,
    projects,
    districts,
  }: {
    news: NewsRecord[],
    abouts: AboutRecord[],
    projects: ProjectRecord[],
    districts: DistrictRecord[],
  } = await apiQuery([MenuDocument], { variables: { districtId, first: 100 } });

  const district = districts.find(({ id }) => id === districtId)

  const menu = base.map(item => {
    let items: MenuItem[];
    switch (item.type) {
      case 'news':
        items = news.map(el => ({ type: 'news', label: el.title, slug: `/aktuellt/${el.slug}` }))
        break;
      case 'about':
        items = abouts.map(el => ({ type: 'about', label: el.title, slug: `/om/${el.slug}` }))
        item.slug = items[0]?.slug ?? item.slug
        break;
      case 'project':
        items = projects.map(el => ({ type: 'project', label: el.title, slug: `/projekt/${el.slug}` }))
        break;
      case 'district':
        items = districts.filter(({ subdomain }) => primarySubdomain !== subdomain).map(el => ({ type: 'district', label: el.name, slug: `/${el.subdomain}`, subdomain: el.subdomain }))
        break;
      case 'contact':
        items = [
          { type: 'contact', label: 'Facebook', slug: district.facebook, subdomain: district.subdomain },
          { type: 'contact', label: 'Instagram', slug: district.instagram, subdomain: district.subdomain },
        ]
        break;
      default:
        break;
    }
    return { ...item, items: items ? items : item.items, subdomain: district.subdomain }
  })

  return menu
}