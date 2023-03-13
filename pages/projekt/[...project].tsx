import s from './[...project].module.scss'
import withGlobalProps from "/lib/withGlobalProps";
import { apiQueryAll, mainDistrict } from '/lib/utils';
import { apiQuery } from "dato-nextjs-utils/api";
import { ProjectDocument, ProjectSubpageDocument, AllProjectsDocument } from "/graphql";
import { Aside, Article, Loader } from '/components';
import Link from 'next/link';

export type Props = {
  project: ProjectRecord | ProjectSubpageRecord
}

export default function ProjectItem({ project: { id, title, slug, image, intro, content }, project }: Props) {

  return (
    <>
      <Aside>
        <h3>{title}</h3>
        {project.__typename === 'ProjectRecord' && project.subpage.length > 0 &&
          <ul className={s.submenu}>
            {project.subpage.map(({ id, slug: subslug, title }) =>
              <li key={id}>
                <Link href={`/projekt/${slug}/${subslug}`}>{title}</Link>
              </li>
            )}
          </ul>
        }

      </Aside>
      <Article
        id={id}
        title={title}
        intro={intro}
        content={content}
        record={project}
        backLink={'/projekt'}
      />
    </>
  );
}

export async function getStaticPaths(context) {

  const district = await mainDistrict()
  const { projects }: { projects: ProjectRecord[] } = await apiQueryAll(AllProjectsDocument, { variables: { districtId: district.id } })
  const paths = []

  projects.forEach(({ slug, subpage }) => {
    paths.push({ params: { project: [slug] } })
    subpage.forEach(({ slug: subslug }) => paths.push({ params: { project: [slug, subslug] } }))
  })

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {

  const isSubpage = context.params.project.length === 2
  const slug = context.params.project[!isSubpage ? 0 : 1]
  const { project } = await apiQuery(!isSubpage ? ProjectDocument : ProjectSubpageDocument, { variables: { slug }, preview: context.preview })

  if (!project)
    return { notFound: true }

  return {
    props: {
      ...props,
      project,
      page: {
        title: project.title,
        subtitle: project.subtitle,
        image: project.image,
        intro: project.intro,
        layout: 'project'
      }
    }
  };
});