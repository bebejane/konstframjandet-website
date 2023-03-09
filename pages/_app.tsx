import '/lib/styles/index.scss'
import { Layout } from '/components';
import { PageProvider, usePage } from '/lib/context/page'
import { useEffect } from 'react';
import { DefaultDatoSEO } from 'dato-nextjs-utils/components';
import { sv } from 'date-fns/locale'
import setDefaultOptions from 'date-fns/setDefaultOptions';

setDefaultOptions({ locale: sv })

const siteTitle = 'Konstnärsfrämjandet'

function App({ Component, pageProps, router }) {

  const { district } = pageProps
  const isHome = router.asPath === '/'

  useEffect(() => {
    console.log(isHome)
    const r = document.querySelector<HTMLElement>(':root')
    r.style.setProperty('--background', isHome ? district?.color?.hex : 'var(--light-grey)');
    r.style.setProperty('--page-color', district?.color?.hex);

  }, [isHome, district])

  const errorCode = parseInt(router.pathname.replace('/', ''))
  const isError = (!isNaN(errorCode) && (errorCode > 400 && errorCode < 600)) || router.pathname.replace('/', '') === '_error'
  if (isError) return <Component {...pageProps} />

  return (
    <>
      <DefaultDatoSEO siteTitle={siteTitle} />
      <PageProvider value={{ district: pageProps.district, title: siteTitle }}>
        <Layout
          title={pageProps.pageTitle}
          menu={pageProps.menu || []}
          footer={pageProps.footer}
          districts={pageProps.districts}
        >
          <Component {...pageProps} />
        </Layout>
      </PageProvider>
    </>
  );
}

export default App;
