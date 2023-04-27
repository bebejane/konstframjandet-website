import { apiQueryAll, primarySubdomain } from "/lib/utils";
import { AllProjectsDocument } from "/graphql";
export { default, getStaticProps } from '/pages/projekt/[...project]'

export async function getStaticPaths() {
  const { projects }: { projects: ProjectRecord[] } = await apiQueryAll(AllProjectsDocument)
  const paths = []

  projects.filter(({ district: { subdomain } }) => subdomain !== primarySubdomain).forEach(({ slug, subpage, district }) => {
    paths.push({ params: { district: district.subdomain, project: [slug] } })
    subpage?.forEach(({ slug: subslug }) => paths.push({ params: { district: district.subdomain, project: [slug, subslug] } }))
  })

  return {
    paths,
    fallback: 'blocking'
  }
}