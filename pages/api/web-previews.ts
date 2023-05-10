import type { NextApiRequest, NextApiResponse } from 'next'
import { allDistricts, primarySubdomain } from '/lib/utils';
import { apiQuery } from 'dato-nextjs-utils/api';
import { withWebPreviews } from 'dato-nextjs-utils/hocs';
import { ProjectBySubpageDocument } from '/graphql';

export default withWebPreviews(async ({ item, itemType, locale }) => {

  let path = null;
  const { slug, district: districtId } = item.attributes
  const district = districtId ? (await allDistricts()).find(({ id }) => id === districtId) : undefined
  const districtSlug = district && district.subdomain !== primarySubdomain ? `/${district.subdomain}` : '' //TODO: change to real subdomains

  switch (itemType.attributes.api_key) {
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
      const { project } = await apiQuery(ProjectBySubpageDocument, { variables: { subpageId: item.id } })
      project && (path = `/projekt/${project.slug}/${slug}`)
      break;
    case 'district':
      path = '/';
      break;
    default:
      break;
  }

  return path ? `${districtSlug}${path}` : null
})