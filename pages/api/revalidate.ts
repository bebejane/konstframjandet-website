import { withRevalidate } from 'dato-nextjs-utils/hoc'

export default withRevalidate(async (record, revalidate) => {

  const { api_key: apiKey, } = record.model;
  const { slug } = record

  const paths = []

  switch (apiKey) {
    case 'about':
      paths.push(`/om/${slug}`)
      break;
    case 'project':
      paths.push(`/projekt/${slug}`)
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
  revalidate(paths)
})