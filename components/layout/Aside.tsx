import s from './Aside.module.scss'

export type Props = {
  children: React.ReactNode[] | React.ReactNode
}

export default function Aside({ children }: Props) {
  return (
    <aside className={s.aside}>
      <div className="mid">
        {children}
      </div>
    </aside>
  )
}
