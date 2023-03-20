import s from './Aside.module.scss'
import cn from 'classnames'

export type Props = {
  children: React.ReactNode[] | React.ReactNode
  title?: string
  hideOnMobile?: boolean
}

export default function Aside({ children, title, hideOnMobile = false }: Props) {

  return (
    <aside className={cn(s.aside, hideOnMobile && s.hideMobile)}>
      {title && children &&
        <h3>{title}</h3>
      }
      {children &&
        <div className="mid">
          {children}
        </div>
      }
    </aside>
  )
}
