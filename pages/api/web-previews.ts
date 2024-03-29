import { allDistricts, primarySubdomain } from '/lib/utils';

import { apiQuery } from 'dato-nextjs-utils/api';
import { withWebPreviewsEdge } from 'dato-nextjs-utils/hoc';
import { ProjectBySubpageDocument } from '/graphql';

export const config = {
  runtime: 'edge'
}

export default withWebPreviewsEdge(async ({ item, itemType, locale }) => {

  let path = null;
  const { slug } = item.attributes
  const districtId = itemType.attributes.api_key === 'district' ? item.id : item.attributes.district;
  const district = districtId ? (await allDistricts()).find(({ id }) => id === districtId) : undefined
  const districtSlug = district && district.subdomain !== primarySubdomain ? `https://${district.subdomain}.konstframjandet.se` : '' //TODO: change to real subdomains

  switch (itemType.attributes.api_key) {
    case 'start':
      path = `/`;
      break;
    case 'news':
      path = `/aktuellt/${slug}`;
      break;
    case 'about':
      path = `/om/${slug}`;
      break;
    case 'project':
      path = `/projekt/${slug}`;
      break;
    case 'project_subpage':
      const { project } = await apiQuery(ProjectBySubpageDocument, { variables: { subpageId: item.attributes.id } })
      project && (path = `/projekt/${project.slug}/${slug}`)
      break;
    case 'district':
      path = '/';
      break;
    case 'start':
      path = '/';
      break;
    default:
      break;
  }

  return path ? `${districtSlug}${path}` : null
})