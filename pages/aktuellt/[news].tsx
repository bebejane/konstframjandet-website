import s from './[news].module.scss'
import withGlobalProps from "/lib/withGlobalProps";
import { apiQuery } from "dato-nextjs-utils/api";
import { NewsDocument, AllNewsDocument } from "/graphql";
import { Article, Aside } from '/components';
import { apiQueryAll } from '/lib/utils';
import format from 'date-fns/format';
import { capitalize } from '/lib/utils';

export type Props = {
  news: NewsRecord
}

export default function NewsItem({ news: {
  id,
  title,
  intro,
  image,
  content,
  address,
  date,
  misc,
  externalLink,
  time,
  where,
  subtitle,
}, news }: Props) {

  const haveMeta = [where, address, date, time, misc].filter(el => el).length > 0

  return (
    <>
      <Aside
        title={'Var & när'}
        backLink={'/aktuellt'}
        backLinkType={'aktuellt'}
      >
        {haveMeta &&
          <>
            <p>
              {where && <>{where}<br /></>}
              {address && <>{address}<br /></>}
              {date && <>{capitalize(format(new Date(date), 'd MMMM'))}<br /></>}
              {time && <>{time}<br /></>}
              {misc && <>{misc}</>}
            </p>
          </>
        }
      </Aside>
      <Article
        id={id}
        record={news}
        title={title}
        subtitle={subtitle}
        image={image}
        intro={intro}
        content={content}
        date={date}
        backLink={'/aktuellt'}
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
      news,
      page: {
        title: news.title,
        subtitle: news.subtitle
      }
    },
    revalidate
  }
})


