import { apiQueryAll } from "/lib/utils";
import { AllProjectsDocument } from "/graphql";
export { default, getStaticProps } from '/pages/projekt/[...project]'

export async function getStaticPaths() {
  const { projects }: { projects: ProjectRecord[] } = await apiQueryAll(AllProjectsDocument)
  const paths = []

  projects.forEach(({ slug, subpage, district }) => {
    paths.push({ params: { district: district.name, project: [slug] } })
    subpage.forEach(({ slug: subslug }) => paths.push({ params: { district: district.name, project: [slug, subslug] } }))
  })

  return {
    paths,
    fallback: 'blocking'
  }
}