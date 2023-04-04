type PageProps = {
  district: DistrictRecord
  title?: string
  subtitle?: string
  image?: FileField
  intro?: string
  color?: string
  colorOption?: string
  layout: 'full' | 'project' | 'home' | 'news'
  isHome: boolean
  isMainDistrict: boolean
}

type ThumbnailImage = {
  thumb: FileField
}
