import s from "./Search.module.scss";
import cn from 'classnames'
import { Loader } from "/components";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DatoMarkdown as Markdown } from "dato-nextjs-utils/components";
import useStore from "/lib/store";
import { useRouter } from "next/router";

export type Props = {}

export default function SearchResult({ }: Props) {

  const router = useRouter()

  const [query, setSearchQuery] = useStore((state) => [state.searchQuery, state.setSearchQuery])
  const [results, setResults] = useState<any | undefined>()
  const [error, setError] = useState<Error | undefined>()
  const [loading, setLoading] = useState<boolean>(false)
  const searchTimeout = useRef<NodeJS.Timer | null>(null)

  const siteSearch = (q) => {
    const variables = {
      q: q ? `${q.split(' ').filter(el => el).join('|')}` : undefined
    };

    if (!Object.keys(variables).filter(k => variables[k] !== undefined).length)
      return setLoading(false)

    fetch('/api/search', {
      body: JSON.stringify(variables),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async (res) => {
        const results = await res.json()
        if (res.status === 200) {
          setResults(results)
        } else
          setError(new Error('error in search'))
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setResults(undefined)
    setLoading(true)
    setError(undefined)

    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => siteSearch(query), 250)
  }, [query])

  useEffect(() => {
    const handleRouteChangeStart = (path: string) => setSearchQuery(undefined)
    router.events.on('routeChangeComplete', handleRouteChangeStart)
    return () => router.events.off('routeChangeComplete', handleRouteChangeStart)
  }, [])

  if (!query) return null

  return (
    <div className={s.container}>
      {results && Object.keys(results).length > 0 ?
        <>
          <h2>result</h2>
          {Object.keys(results).map((type, idx) =>
            <ul key={idx}>
              <li><h3>{results[type][0].category}</h3></li>
              {results[type]?.map(({ category, title, text, image, slug }, i) =>
                <li key={i}>
                  <h1>
                    <Link href={slug}>{title}</Link>
                  </h1>
                  <div className={s.intro}>
                    <Markdown>{text}</Markdown>
                  </div>
                  <Link href={slug}><button>read more</button></Link>
                </li>
              )}
            </ul>
          )}
        </>
        :
        loading ?
          <div className={s.loading}><Loader /></div>
          :
          results && <p className={cn(s.nohits, "small")}>Inga träffar: &quot;{query}&quot;</p>
      }
      {error &&
        <div className={s.error}>
          <p>
            {typeof error === 'string' ? error : error.message}
          </p>
        </div>
      }
    </div >

  );
}
