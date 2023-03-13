import { withRevalidate } from 'dato-nextjs-utils/hoc'
import { apiQuery } from 'dato-nextjs-utils/api';
import { ProjectBySubpageDocument } from '/graphql';

export default withRevalidate(async (record, revalidate) => {

  const { api_key: apiKey, } = record.model;
  const { id, slug } = record

  const paths = []

  switch (apiKey) {
    case 'about':
      paths.push(`/om/${slug}`)
      break;
    case 'project':
      paths.push(`/projekt/${slug}`)
      break;
    case 'project_subpage':
      const { project } = await apiQuery(ProjectBySubpageDocument, { variables: { projectId: id } })
      console.log(project)
      if (project)
        paths.push(`/projekt/${project.slug}/${slug}`)
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
  console.log(paths)
  revalidate(paths)
})