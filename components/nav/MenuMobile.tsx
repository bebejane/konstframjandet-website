import s from './MenuMobile.module.scss'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import { usePage } from '/lib/context/page'
import { animateLogo, districtUrl } from '/lib/utils'
import type { Menu } from '/lib/menu'
import Link from 'next/link'

export type Props = {
  districts: DistrictRecord[]
  menu: Menu
}

export default function MenuMobile({ menu }: Props) {

  const router = useRouter()
  const { district, isMainDistrict, isHome } = usePage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLElement | null>(null)
  const [subSelected, setSubSelected] = useState<string | null>(null)

  // Remove some sub items
  menu = menu.map((item) => ['about', 'district'].includes(item.type) ? item : { ...item, items: [] })

  useEffect(() => {
    const handleRouteChangeStart = (path: string) => {
      setOpen(false)
      animateLogo('logo-mobile')
    }
    router.events.on('routeChangeStart', handleRouteChangeStart)
    return () => router.events.off('routeChangeStart', handleRouteChangeStart)
  }, [])

  useEffect(() => {

    const r = document.querySelector<HTMLElement>(':root')
    r.style.setProperty('--page-color', open ? 'var(--black)' : district?.color?.hex);
    r.style.setProperty('--background', open ? 'var(--black)' : isHome ? district?.color?.hex : 'var(--light-grey)');

  }, [open])

  return (
    <>
      <header className={cn(s.navbar, open && s.open)}>
        <Link id="logo-mobile" href={'/'} className={s.logo}>A</Link>
        <h2>{isMainDistrict ? 'Konstfrämjandet' : `${district.name}`}</h2>
        <div className={cn(s.hamburger, 'symbol')} onClick={() => setOpen(!open)}>
          {open ? '5' : '2'}
        </div>
        <div className={s.line}></div>
      </header>
      <div className={cn(s.menuMobile, open && s.open)}>
        <nav className={s.menu} ref={ref}>
          <ul>
            {menu.filter(({ type }) => !(type === 'district' && !isMainDistrict)).map(({ type, slug, label, items }) =>
              <li className={cn(s.active)} key={type}>
                {slug && !items?.length ?
                  <Link href={slug}>{label}</Link>
                  :
                  <>
                    <span onClick={() => setSubSelected(type === subSelected ? null : type)}>{label}</span>
                    <ul className={cn(type === subSelected && s.expanded)}>
                      {items.map(({ type, slug, label, subdomain }, idx) =>
                        <li key={idx}>
                          <Link
                            href={type === 'district' ? districtUrl(subdomain) : slug}
                            locale={type === 'district' ? subdomain : undefined}
                          >{label}</Link>
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
