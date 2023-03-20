import s from './Aside.module.scss'
import cn from 'classnames'

export type Props = {
  children: React.ReactNode[] | React.ReactNode
  title?: string
}

export default function Aside({ children, title }: Props) {

  return (
    <aside className={s.aside}>
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
