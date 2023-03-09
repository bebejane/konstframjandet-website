import districts from "/lib/districts.json";
export { default, getStaticProps } from '/pages/kontakt'

export async function getStaticPaths() {

  const paths = districts.map(({ subdomain }) => ({ params: { district: subdomain } }))

  return {
    paths,
    fallback: 'blocking',
  };
}
