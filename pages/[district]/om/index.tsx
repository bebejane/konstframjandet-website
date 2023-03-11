import { allDistricts } from '/lib/utils';
export { default, getStaticProps } from '/pages/om'

export async function getStaticPaths() {

  const districts = await allDistricts()
  const paths = districts.map(({ subdomain }) => ({ params: { district: subdomain } }))

  return {
    paths,
    fallback: 'blocking',
  };
}
