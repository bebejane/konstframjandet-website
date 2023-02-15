import { regions } from '/lib/region';
import { apiQuery } from 'dato-nextjs-utils/api';
import { LatestNewsDocument, AllAboutsMenuDocument, AllConsultsDocument, LatestProjectsDocument, AllForArtistDocument } from "/graphql";

export type Menu = MenuItem[]

export type MenuItem = {
  type: string
  index?: boolean
  label: string
  slug?: string
  regional?: boolean
  external?: boolean
  sub?: MenuItem[]
}

const base: Menu = [
  { type: 'about', label: 'Om', regional: false, slug: '/om' },
  {
    type: 'consult', label: 'Anlita oss', slug: '/anlita-oss', sub: [
      { type: 'consult', label: 'Utvalda uppdrag', slug: '/anlita-oss/uppdrag', regional: false },
      { type: 'consult', label: 'Hitta konstnär', slug: '/anlita-oss/hitta-konstnar', regional: true }
    ]
  },
  {
    type: 'for-artists', label: 'För konstnärer', slug: '/konstnar', sub: [
      { type: 'for-artists', label: 'Bli medlem', slug: '/konstnar/bli-medlem', regional: false },
      { type: 'for-artists', label: 'Logga in', slug: '/konstnar/konto/logga-in', regional: false },
      { type: 'for-artists', label: 'Aktuellt', slug: '/konstnar/aktuellt', regional: true },
      { type: 'for-artists', label: 'Medlemmar', slug: '/for-konstnarer/medlemmar', regional: true }
    ]
  },
  { type: 'projects', label: 'Våra initiativ', slug: '/vara-initiativ', regional: true, index: true, external: true, sub: [] },
  { type: 'news', label: 'Nyheter', slug: '/nyheter', index: true, regional: true, sub: [] },
  { type: 'contact', label: 'Kontakt', slug: '/kontakt', index: true, regional: true, sub: [] },
]

export const buildMenu = async () => {

  const {
    news,
    abouts,
    consults,
    projects,
    forArtists
  }: {
    news: NewsRecord[],
    abouts: AboutRecord[],
    consults: ConsultRecord[],
    projects: ProjectRecord[],
    forArtists: ForArtistRecord[]
  } = await apiQuery([
    LatestNewsDocument,
    LatestProjectsDocument,
    AllAboutsMenuDocument,
    AllConsultsDocument,
    AllForArtistDocument
  ], { variables: [{ first: 5 }, { first: 5 }] });

  const menu = base.map(item => {
    let sub: MenuItem[];
    switch (item.type) {
      case 'news':
        sub = news.slice(0, 5).map(el => ({ type: 'news', label: el.title, slug: `/nyheter/${el.slug}`, regional: false }))
        break;
      case 'about':
        sub = abouts.map(el => ({ type: 'about', label: el.title, slug: `/om/${el.slug}`, regional: false }))
        break;
      case 'consult':
        sub = consults.map(el => ({ type: 'about', label: el.title, slug: `/anlita-oss/${el.slug}`, regional: false })).concat(item.sub)
        break;
      case 'projects':
        sub = projects.map(el => ({ type: 'projects', label: el.title, slug: el.url }))
        break;
      case 'contact':
        sub = regions.filter(({ global }) => !global).map(el => ({ type: 'contact', label: el.name, slug: `/${el.slug}/kontakt`, regional: false }))
        break;
      case 'for-artists':
        sub = item.sub.concat(forArtists.map(el => ({ type: 'for-artists', label: el.title, slug: `/for-konstnarer/${el.slug}`, regional: false })))
        break;
      default:
        break;
    }
    return { ...item, sub: sub ? sub : item.sub }
  })

  return menu
}