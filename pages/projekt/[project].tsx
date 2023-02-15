import s from './[project].module.scss'
import withGlobalProps from "/lib/withGlobalProps";
import { GetStaticProps } from "next";
import { apiQuery } from "dato-nextjs-utils/api";
import { ProjectDocument, AllProjectsDocument } from "/graphql";
import { format } from "date-fns";

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

export const getServerSideProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

  const slug = context.params.project;
  const { project } = await apiQuery(ProjectDocument, { variables: { slug }, preview: context.preview })

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