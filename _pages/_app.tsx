import '/lib/styles/index.scss'
import "swiper/css";
import { useState } from 'react';
import { Layout } from '/components';
import { PageProvider, usePage } from '/lib/context/page'
import { useEffect } from 'react';
import { DefaultDatoSEO } from 'dato-nextjs-utils/components';
import { sv } from 'date-fns/locale'
import { primarySubdomain } from '/lib/utils';
import setDefaultOptions from 'date-fns/setDefaultOptions';

setDefaultOptions({ locale: sv })

function App({ Component, pageProps, router }) {

  const [isHome, setIsHome] = useState(false)
  const { asPath } = router
  const { district, districts, footer, menu, site, seo } = pageProps

  const page = pageProps.page || {} as PageProps

  useEffect(() => {
    const isHome = asPath === '/' || districts?.find(({ subdomain }) => `/${subdomain}` === asPath) !== undefined
    setIsHome(isHome)
  }, [asPath, districts])

  useEffect(() => {

    const r = document.querySelector<HTMLElement>(':root')
    r.style.setProperty('--page-color', district?.color?.hex);
    r.style.setProperty('--background', isHome ? district?.color?.hex : 'var(--light-grey)');

  }, [isHome, district])

  const errorCode = parseInt(router.pathname.replace('/', ''))
  const isError = (!isNaN(errorCode) && (errorCode > 400 && errorCode < 600)) || router.pathname.replace('/', '') === '_error'

  if (isError)
    return <Component {...pageProps} />

  const isMainDistrict = district?.subdomain === primarySubdomain
  const siteTitle = `Konstfrämjandet${!isMainDistrict ? ` ${district?.name}` : ''}`

  return (
    <>
      <DefaultDatoSEO siteTitle={siteTitle} site={site} path={asPath} />
      <PageProvider value={{ district, ...page, isHome }} key={router.locale}>
        <Layout
          title={page?.title}
          menu={menu}
          footer={footer}
          districts={districts}
        >
          <Component {...pageProps} />
        </Layout>
      </PageProvider>
    </>
  );
}

export default App;
