import s from './[news].module.scss'
import withGlobalProps from "/lib/withGlobalProps";
import { apiQuery } from "dato-nextjs-utils/api";
import { NewsDocument, AllNewsDocument } from "/graphql";
import { format } from "date-fns";
import { apiQueryAll } from '/lib/utils';
import { DatoMarkdown as Markdown } from 'dato-nextjs-utils/components';
export type Props = {
  news: NewsRecord
}

export default function NewsItem({ news: { id, _createdAt, title, intro, district, slug, _seoMetaTags } }: Props) {

  return (
    <>
      {title}
      <Markdown>{intro}</Markdown>
    </>
  );
}
//NewsItem.page = { crumbs: [{ slug: 'nyheter', title: 'Nyheter' }], regional: true } as PageProps

export async function getStaticPaths() {
  const { news } = await apiQueryAll(AllNewsDocument)
  const paths = news.map(({ slug }) => ({ params: { news: slug } }))
  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {
  const slug = context.params.news;
  const { news } = await apiQuery(NewsDocument, { variables: { slug, districtId: props.district.id }, preview: context.preview })
  return {
    props: {
      ...props,
      news
    },
    revalidate
  }
})


