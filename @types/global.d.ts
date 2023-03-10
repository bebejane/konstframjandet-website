type PageProps = {
  district: DistrictRecord
  title?: string
  image?: FileField
  intro?: string
  layout: 'full' | 'project' | 'home'
  isHome: boolean
}

type ThumbnailImage = {
  thumb: FileField
}
