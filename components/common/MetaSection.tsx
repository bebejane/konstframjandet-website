import s from './MetaSection.module.scss'
import Link from 'next/link'

export type Props = {
  items: {
    title: string
    value: string
    link?: string
  }[]
}

export default function MetaSection({ items = [] }: Props) {

  return (
    <section className={s.meta}>
      <ul className="small">
        {items.filter(({ value, title }) => value && title).map(({ title, value, link }, idx) =>
          <li key={idx}>
            {title}:&nbsp;
            <strong>
              {link ?
                <Link href={link}>{value}</Link>
                :
                <>{value}</>
              }
            </strong>
          </li>
        )}
      </ul>
    </section>
  )
}
