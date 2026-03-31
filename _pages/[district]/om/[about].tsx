import { getStaticDistrictPaths } from "/lib/utils";
import { AllAboutsDocument } from "/graphql";
export { default, getStaticProps } from '/pages/om/[about]'

export async function getStaticPaths() {
  return getStaticDistrictPaths(AllAboutsDocument, 'abouts')
}
