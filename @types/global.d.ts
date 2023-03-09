type PageProps = {
  district: DistrictRecord
  title?: string
  image?: FileField
  intro?: string
  layout: 'full' | 'project' | 'home'
}

type ThumbnailImage = {
  thumb: FileField
}
