import s from './MetaSection.module.scss'

export type Props = {
  children: React.ReactNode[] | React.ReactNode
}

export default function MetaSection({ children }: Props) {
  return (
    <section className={s.meta}>
      <div className="mid">
        {children}
      </div>
    </section>
  )
}
