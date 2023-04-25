import s from './Loader.module.scss'
import cn from 'classnames'
import { sleep } from '/lib/utils'
import { useEffect, useRef } from 'react'

type Props = {
  message?: string
  loading?: boolean
  className?: string
  color?: string
  invert?: boolean
  size?: number
}

const animateLoader = async () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const logo = document.getElementById('loader') as HTMLAnchorElement
  for (let i = 0; i < alphabet.length; i++) {
    logo.innerText = alphabet[i]
    await sleep(20)
  }
  logo.innerText = alphabet[0]
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Loader({ loading = true, className, invert = false }: Props) {
  if (!loading) return null

  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {

    const animateLoader = async () => {
      for (let i = 0; i < alphabet.length; i++) {
        if (!ref.current) return
        ref.current.innerText = alphabet[i]
        await sleep(20)
      }
      animateLoader()
    }

    animateLoader();

  }, [])

  return (
    <div className={cn(s.container, className, invert && s.invert)}>
      <span ref={ref}>A</span>
    </div>
  )
}