import s from './[...project].module.scss'
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { apiQueryAll, mainDistrict } from '/lib/utils';
import { apiQuery } from "dato-nextjs-utils/api";
import { ProjectDocument, ProjectSubpageDocument, ProjectBySubpageDocument, AllProjectsDocument } from "/graphql";
import { Aside, Article, SideMenu } from '/components';
import { useEffect } from 'react';
import { usePage } from '/lib/context/page';
import { useRouter } from 'next/router';

export type Props = {
  project: ProjectRecord | ProjectSubpageRecord,
  parentProject?: ProjectRecord
  projectMenu: {
    id: string
    slug: string
    title: string
  }[]
}

export default function ProjectItem({ project: { id, title, slug, image, intro, content }, project, parentProject, projectMenu }: Props) {

  const { asPath } = useRouter()
  const { isHome, district } = usePage()

  useEffect(() => {

    const color = project.__typename === 'ProjectRecord' ? project.color : parentProject?.color ?? null
    const r = document.querySelector<HTMLElement>(':root')

    setTimeout(() => { // Override _app styling
      r.style.setProperty('--page-color', color ? color.hex : district?.color?.hex);
    }, 30)

  }, [isHome, project, parentProject, asPath])

  return (
    <>
      <Aside title={parentProject?.title ?? title}>
        {projectMenu.length > 0 &&
          <SideMenu items={projectMenu} />
        }
      </Aside>
      <Article
        id={id}
        title={title}
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

  let parentProject = null;

  if (isSubpage)
    parentProject = (await apiQuery(ProjectBySubpageDocument, { variables: { subpageId: project.id }, preview: context.preview }))?.project ?? null

  const projectMenu = (project.subpage ?? parentProject.subpage).map(({ id, title, slug }) => ({
    id,
    title,
    slug: `/projekt/${isSubpage ? parentProject.slug : project.slug}/${slug}`
  }))

  return {
    props: {
      ...props,
      project,
      parentProject,
      projectMenu,
      page: {
        title: project.title,
        subtitle: project.subtitle,
        image: project.image,
        intro: project.intro,
        layout: 'project',
        color: parentProject?.color?.hex ?? project.color?.hex ?? null
      }
    }
  };
});