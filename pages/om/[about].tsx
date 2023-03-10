import s from "./[about].module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { apiQuery } from 'dato-nextjs-utils/api';
import { apiQueryAll } from '/lib/utils';
import { AboutDocument, AllAboutsDocument } from "/graphql";
import { MetaSection, Article } from '/components';
import Link from 'next/link';

export type Props = {
  about: AboutRecord
  abouts: AboutRecord[]
}

export default function AboutItem({ about: { id, content, intro, slug, _seoMetaTags }, abouts }: Props) {

  return (
    <>
      <MetaSection>
        <ul className={s.submenu}>
          {abouts.length > 0 ? abouts.map((about, idx) =>
            <li key={about.id}>
              {about.slug !== slug ?
                <Link href={`/om/${about.slug}`}>{about.title}</Link>
                :
                <span className={s.active}>{about.title}</span>
              }
            </li>
          ) :
            <>Det finns inga Om...</>
          }
        </ul>
      </MetaSection>
      <Article
        id={'id'}
        intro={intro}
        content={content}
        record={{}}
      />
    </>
  )
}

export async function getStaticPaths() {
  const { abouts } = await apiQueryAll(AllAboutsDocument)
  const paths = abouts.map(({ slug }) => ({ params: { about: slug } }))

  return {
    paths,
    fallback: 'blocking'
  }
}

//AboutItem.page = { crumbs: [{ slug: 'nyheter', title: 'Nyheter' }], regional: true } as PageProps

export const getStaticProps = withGlobalProps({ queries: [AllAboutsDocument] }, async ({ props, revalidate, context }: any) => {

  const slug = context.params.about;
  const { about } = await apiQuery(AboutDocument, { variables: { slug, districtId: props.district.id }, preview: context.preview })

  if (!about)
    return { notFound: true }

  return {
    props: {
      ...props,
      about,
      page: {
        title: about.title
      }
    }
  };
});