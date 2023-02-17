import s from './[about].module.scss'
import withGlobalProps from "/lib/withGlobalProps";
import { apiQuery } from 'dato-nextjs-utils/api';
import { apiQueryAll } from '/lib/utils';
import { AboutDocument, AllAboutsDocument } from "/graphql";

export type Props = {
  about: AboutRecord
}

export default function AboutItem({ about: { id, _createdAt, title, district, slug, _seoMetaTags } }: Props) {

  return (
    <>
      {title}
    </>
  );
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

export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {


  const slug = context.params.about;
  const { about } = await apiQuery(AboutDocument, { variables: { slug, districtId: props.district.id }, preview: context.preview })
  const { abouts } = await apiQueryAll(AllAboutsDocument)
  console.log(about, { variables: { slug, districtId: props.district.id } })
  if (!about)
    return { notFound: true }

  return {
    props: {
      ...props,
      about,
      pageTitle: about.title
    }
  };
});

export const config = {
  runtime: 'experimental-edge'
}