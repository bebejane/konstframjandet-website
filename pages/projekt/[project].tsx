import s from './[project].module.scss'
import withGlobalProps from "/lib/withGlobalProps";
import { apiQueryAll } from '/lib/utils';
import { apiQuery } from "dato-nextjs-utils/api";
import { ProjectDocument, AllProjectsDocument } from "/graphql";

export type Props = {
  project: ProjectRecord
}

export default function ProjectItem({ project: { id, _createdAt, title, district, slug, _seoMetaTags } }: Props) {

  return (
    <>
      {title}
    </>
  );
}

//ProjectItem.page = { crumbs: [{ slug: 'nyheter', title: 'Nyheter' }], regional: true } as PageProps

export async function getStaticPaths() {
  const { projects } = await apiQueryAll(AllProjectsDocument)
  const paths = projects.map(({ slug }) => ({ params: { project: slug } }))
  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

  const slug = context.params.project;
  const { project } = await apiQuery(ProjectDocument, { variables: { slug, districtId: props.district.id }, preview: context.preview })

  if (!project)
    return { notFound: true }

  return {
    props: {
      ...props,
      project,
      pageTitle: project.title
    }
  };
});

export const config = {
  runtime: 'experimental-edge'
}