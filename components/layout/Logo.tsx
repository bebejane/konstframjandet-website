import s from './Logo.module.scss'
import { usePage } from '/lib/context/page'
import Link from 'next/link'

export type Props = {

}

export default function Logo({ }: Props) {

  return (
    <div className={s.container}>
      <Link href={'/'}>Logo</Link>
    </div>
  )
}