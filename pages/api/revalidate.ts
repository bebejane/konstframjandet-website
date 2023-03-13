import { withRevalidate } from 'dato-nextjs-utils/hoc'
import { apiQuery } from 'dato-nextjs-utils/api';
import { allDistricts } from '/lib/utils';
import { ProjectBySubpageDocument } from '/graphql';

export default withRevalidate(async (record, revalidate) => {

  const { api_key: apiKey, } = record.model;
  const { id, slug, district: districtId } = record
  const district = districtId ? (await allDistricts()).find(({ id }) => id === districtId) : undefined
  const paths = []

  switch (apiKey) {
    case 'about':
      paths.push(`/om/${slug}`)
      break;
    case 'project':
      paths.push(`/projekt/${slug}`)
      break;
    case 'project_subpage':
      const { project } = await apiQuery(ProjectBySubpageDocument, { variables: { subpageId: id } })
      project && paths.push(`/projekt/${project.slug}/${slug}`)
      break;
    case 'news':
      paths.push(`/aktuellt/${slug}`)
      break;
    case 'district':
      paths.push(`/`)
      paths.push(`/om`)
      paths.push(`/projekt`)
      paths.push(`/aktuellt`)
      break;
    default:
      break;
  }

  if (district)
    paths.forEach((path, idx) => paths[idx] = `/${district.subdomain}${path}`)

  revalidate(paths)
})