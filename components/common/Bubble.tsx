import s from './Bubble.module.scss'
import cn from 'classnames'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { randomInt } from '/lib/utils'

type Props = {
  children: string | React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export default function Bubble({ href, className, children, onClick, disabled = false }: Props) {

  const [styles, setStyles] = useState({})
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    const corner = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'][randomInt(0, 3)]
    setStyles({ [`border${corner}Radius`]: `${50 + randomInt(3, 6)}%` })
  }, [toggle])

  const button = (
    <button
      className={cn(s.bubble, 'mid', className)}
      disabled={disabled}
      style={styles}
      onMouseLeave={() => setToggle(!toggle)}
      onClick={onClick}
    >
      {children}
    </button>
  )

  return href ? <Link href={href}>{button}</Link> : <>{button}</>

}