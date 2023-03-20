import s from './SideMenu.module.scss'
import cn from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

export type Props = {
  items: {
    id: string
    slug: string
    title: string
  }[]
}

export default function SideMenu({ items }: Props) {
  const { asPath } = useRouter()

  if (!items || !items.length) return null

  return (
    <ul className={s.sidemenu}>
      {items.map(({ id, slug, title }) =>
        <li key={id} className={cn(slug === asPath && s.selected)}>
          <Link href={slug}>{title}</Link>
        </li>
      )}
    </ul>
  )
}