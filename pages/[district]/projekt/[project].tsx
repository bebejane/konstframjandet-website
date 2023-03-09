import { getStaticDistrictPaths } from "/lib/utils";
import { AllProjectsDocument } from "/graphql";
export { default, getStaticProps } from '/pages/projekt/[project]'

export async function getStaticPaths() {
  return getStaticDistrictPaths(AllProjectsDocument, 'project')
}
