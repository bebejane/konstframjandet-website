import s from './[news].module.scss'
import withGlobalProps from "/lib/withGlobalProps";
import { GetStaticProps } from "next";
import { apiQuery } from "dato-nextjs-utils/api";
import { NewsDocument, AllNewsDocument } from "/graphql";
import { format } from "date-fns";

export type Props = {
  news: NewsRecord
}

export default function NewsItem({ news: { id, _createdAt, title, district, slug, _seoMetaTags } }: Props) {

  return (
    <>
      {title}
    </>
  );
}

//NewsItem.page = { crumbs: [{ slug: 'nyheter', title: 'Nyheter' }], regional: true } as PageProps

export const getServerSideProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

  const slug = context.params.news;
  const { news } = await apiQuery(NewsDocument, { variables: { slug }, preview: context.preview })

  if (!news)
    return { notFound: true }

  return {
    props: {
      ...props,
      news,
      pageTitle: news.title
    }
  };
});

export const config = {
  runtime: 'experimental-edge'
}