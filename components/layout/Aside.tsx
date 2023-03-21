import s from './Aside.module.scss'
import cn from 'classnames'
import Link from 'next/link'

export type Props = {
  children: React.ReactNode[] | React.ReactNode
  title?: string
  titleHref?: string
  hideOnMobile?: boolean

}

export default function Aside({ children, title, titleHref, hideOnMobile = false }: Props) {

  return (
    <aside className={cn(s.aside, hideOnMobile && s.hideMobile)}>
      {title && children ?
        titleHref ?
          <Link href={titleHref}><h3>{title}</h3></Link>
          :
          <h3>{title}</h3>
        : null
      }
      {children &&
        <div className="mid">
          {children}
        </div>
      }
    </aside>
  )
}
