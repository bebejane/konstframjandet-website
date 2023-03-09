import { getStaticDistrictPaths } from "/lib/utils";
import { AllNewsDocument } from "/graphql";
export { default, getStaticProps } from '/pages/nyheter/[news]'

export async function getStaticPaths() {
  return getStaticDistrictPaths(AllNewsDocument, 'news')
}
