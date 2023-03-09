import s from './[news].module.scss'
import withGlobalProps from "/lib/withGlobalProps";
import { apiQuery } from "dato-nextjs-utils/api";
import { NewsDocument, AllNewsDocument } from "/graphql";
import { Article, MetaSection } from '/components';
import { apiQueryAll } from '/lib/utils';

export type Props = {
  news: NewsRecord
}

export default function NewsItem({ news: { id, _createdAt, title, intro, image, content, district, slug, _seoMetaTags } }: Props) {

  return (
    <>
      <MetaSection>
        meta
      </MetaSection>
      <Article
        id={id}
        title={title}
        image={image}
        intro={intro}
        content={content}
        date={_createdAt}
      />
    </>
  );
}

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

  if (!news) return { notFound: true }

  return {
    props: {
      ...props,
      news
    },
    revalidate
  }
})


