import districts from "/lib/districts.json";
export { default, getStaticProps } from '/pages/aktuellt'

export async function getStaticPaths() {

  const paths = districts.map(({ subdomain }) => ({ params: { district: subdomain } }))

  return {
    paths,
    fallback: 'blocking',
  };
}
