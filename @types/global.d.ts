type PageProps = {
  district: DistrictRecord
  title?: string
  subtitle?: string
  image?: FileField
  intro?: string
  color?: string
  layout: 'full' | 'project' | 'home'
  isHome: boolean
  isMainDistrict: boolean
}

type ThumbnailImage = {
  thumb: FileField
}
