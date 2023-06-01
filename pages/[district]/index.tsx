import { allDistricts } from '/lib/utils';
export { default, getStaticProps } from '/pages'

export async function getStaticPaths() {

	const districts = await allDistricts(true)
	const paths = districts.map(({ subdomain }) => ({ params: { district: subdomain } }))

	return {
		paths: paths,
		fallback: 'blocking',
	};
}
