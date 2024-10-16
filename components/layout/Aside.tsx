import s from './Aside.module.scss'
import { useEffect, useState } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import { useScrollInfo } from 'dato-nextjs-utils/hooks'

export type Props = {
  children: React.ReactNode[] | React.ReactNode
  title?: string
  titleHref?: string
  hideOnMobile?: boolean
  backLink?: string
  backLinkType?: string
}

export default function Aside({ children, title, titleHref, backLink, backLinkType, hideOnMobile = false }: Props) {
  const [isTaller, setIsTaller] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      const asideElement = document.querySelector("aside");
      if (!asideElement) return;

      const navElement = document.querySelector("nav");
      const navHeight = navElement ? navElement.offsetHeight : 0;
      const asideHeight = asideElement.offsetHeight;

      if (asideHeight + navHeight > window.innerHeight) {
        setIsTaller(true);
      } else {
        setIsTaller(false);
        console.log(navHeight)
      }
    };

    checkHeight();
    window.addEventListener("resize", checkHeight);

    return () => {
      window.removeEventListener("resize", checkHeight);
    };
  }, []);

  return (
    <aside className={cn(s.aside, hideOnMobile && s.hideMobile, isTaller && s.taller)}>
      {title && children ?
        titleHref ?
          <Link href={titleHref}><h3>{title}</h3></Link>
          :
          <h3 className="mid">{title}</h3>
        : null
      }
      {children &&
        <div className="mid">
          {children}
        </div>
      }
      {backLink &&
        <div className={s.back}>
          <Link href={backLink} className="mid">Visa alla {backLinkType}</Link>
        </div>
      }
    </aside>
  )
}
