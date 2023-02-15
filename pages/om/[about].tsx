import s from './[about].module.scss'
import withGlobalProps from "/lib/withGlobalProps";
import { GetStaticProps } from "next";
import { apiQuery } from "dato-nextjs-utils/api";
import { AboutDocument, AllAboutsDocument } from "/graphql";
import { format } from "date-fns";

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

//AboutItem.page = { crumbs: [{ slug: 'nyheter', title: 'Nyheter' }], regional: true } as PageProps

export async function getStaticPaths(context) {
  const { abouts } = await apiQuery(AllAboutsDocument)
  const paths = abouts.map(({ slug }) => ({ params: { about: slug } }))
  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

  const slug = context.params.about;
  const { about } = await apiQuery(AboutDocument, { variables: { slug }, preview: context.preview })

  if (!about)
    return { notFound: true }

  return {
    props: {
      ...props,
      about,
      pageTitle: about.title
    },
    revalidate
  };
});