import s from './MetaSection.module.scss'
import Link from 'next/link'

export type Props = {
  children: React.ReactNode[] | React.ReactNode
}

export default function MetaSection({ children }: Props) {

  return (
    <section className={s.meta}>
      {children}
    </section>
  )
}
