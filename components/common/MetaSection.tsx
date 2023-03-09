import s from './MetaSection.module.scss'
import Link from 'next/link'

export type Props = {
  items: {
    title: string
    value: string
    link?: string
  }[]
}

export default function MetaSection({ }: Props) {

  return (
    <section className={s.meta}>
      meta
    </section>
  )
}
