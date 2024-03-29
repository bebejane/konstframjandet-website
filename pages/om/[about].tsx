import withGlobalProps from "/lib/withGlobalProps";
import { apiQuery } from 'dato-nextjs-utils/api';
import { apiQueryAll, mainDistrict } from '/lib/utils';
import { AboutDocument, AllAboutsDocument } from "/graphql";
import { Aside, Article, SideMenu } from '/components';

export type Props = {
  about: AboutRecord
  abouts: AboutRecord[]
}

export default function AboutItem({ about: { id, content, intro, slug, _seoMetaTags }, about, abouts }: Props) {

  return (
    <>
      <Aside hideOnMobile={true}>
        <SideMenu
          items={abouts.map(({ id, slug, title }) => ({ id, title, slug: `/om/${slug}` }))}
        />
      </Aside>
      <Article
        id={'id'}
        intro={intro}
        content={content}
        record={about}
        seo={_seoMetaTags}
      />
    </>
  )
}

export async function getStaticPaths() {
  const { id: districtId } = await mainDistrict()
  const { abouts } = await apiQueryAll(AllAboutsDocument, { variables: { districtId } })
  const paths = abouts.map(({ slug }) => ({ params: { about: slug } }))

  return {
    paths,
    fallback: 'blocking'
  }
}

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
    },
    revalidate
  };
});