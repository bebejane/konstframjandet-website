import s from './MenuMobile.module.scss'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { primarySubdomain } from '/lib/utils'
import { useScrollInfo } from 'dato-nextjs-utils/hooks'
import { usePage } from '/lib/context/page'

import type { Menu } from '/lib/menu'
import Link from 'next/link'

export type Props = {
  districts: DistrictRecord[]
  menu: Menu
}

export default function MenuMobile({ districts, menu }: Props) {

  const router = useRouter()
  const { asPath } = router
  const { district, isHome, isMainDistrict } = usePage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLElement | null>(null)
  const [subSelected, setSubSelected] = useState<string | null>(null)


  useEffect(() => {

    const handleRouteChangeStart = (path: string) => {
      setOpen(false)
    }
    router.events.on('routeChangeStart', handleRouteChangeStart)
    return () => router.events.off('routeChangeStart', handleRouteChangeStart)
  }, [])

  return (
    <>
      <header className={cn(s.navbar, open && s.open)}>
        <Link href={'/'} className={s.logo} locale={primarySubdomain}>A</Link>
        <h2>Konstfrämjandet</h2>
        <div className={cn(s.hamburger, 'symbol')} onClick={() => setOpen(!open)}>
          {open ? '5' : '2'}
        </div>
      </header>
      <div className={cn(s.menuMobile, open && s.open)}>
        <nav className={cn(s.menu)} ref={ref}>
          <ul>
            {menu.map(({ type, slug, label, items }) =>
              <li className={cn(s.active)} key={type}>
                {slug && !items ?
                  <Link href={slug}>{label}</Link>
                  :
                  <>
                    <span onClick={() => setSubSelected(type === subSelected ? null : type)}>{label}</span>
                    <ul className={cn(type === subSelected && s.expanded)}>
                      {items.map(({ type, slug, label }, idx) =>
                        <li key={idx}>
                          <Link href={slug}>{label}</Link>
                        </li>
                      )}
                    </ul>
                  </>
                }
              </li>
            )}
          </ul>
        </nav>
      </div >
    </>
  )
}
