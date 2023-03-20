import s from './Aside.module.scss'
import cn from 'classnames'

export type Props = {
  children: React.ReactNode[] | React.ReactNode
}

export default function Aside({ children }: Props) {

  return (
    <aside className={s.aside}>
      {children &&
        <div className="mid">
          {children}
        </div>
      }
    </aside>
  )
}
