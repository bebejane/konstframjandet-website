type PageProps = {
  district: DistrictRecord
  title?: string
  layout: 'full' | 'project' | 'home'
}

type ThumbnailImage = {
  thumb: FileField
}
