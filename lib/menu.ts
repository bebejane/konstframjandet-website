import { apiQuery } from 'dato-nextjs-utils/api';
import { MenuDocument } from "/graphql";

export type Menu = MenuItem[]

export type MenuItem = {
  type: string
  label: string
  slug?: string
  items?: MenuItem[]
}

const base: Menu = [
  { type: 'news', label: 'Aktuellt', slug: '/aktuellt', items: [] },
  { type: 'project', label: 'Project', slug: '/project', items: [] },
  { type: 'district', label: 'District', items: [] },
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
  } = await apiQuery([
    MenuDocument
  ], { variables: { districtId, first: 100 } });

  const menu = base.map(item => {
    let items: MenuItem[];
    switch (item.type) {
      case 'news':
        items = news.map(el => ({ type: 'news', label: el.title, slug: `/aktuellt/${el.slug}` }))
        break;
      case 'about':
        items = abouts.map(el => ({ type: 'about', label: el.title, slug: `/om/${el.slug}` }))
        break;
      case 'project':
        items = projects.map(el => ({ type: 'project', label: el.title, slug: `/projekt/${el.slug}` }))
        break;
      case 'district':
        items = districts.map(el => ({ type: 'district', label: el.name, slug: `/${el.subdomain}` }))
        break;
      case 'contact':
        items = []
        break;

      default:
        break;
    }
    return { ...item, items: items ? items : item.items }
  })

  return menu
}