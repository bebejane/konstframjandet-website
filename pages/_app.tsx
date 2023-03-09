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

  useEffect(() => {
    document.body.style.backgroundColor = district?.color?.hex
  }, [router.asPath, district])

  const errorCode = parseInt(router.pathname.replace('/', ''))
  const isError = (!isNaN(errorCode) && (errorCode > 400 && errorCode < 600)) || router.pathname.replace('/', '') === '_error'
  if (isError) return <Component {...pageProps} />

  return (
    <>
      <DefaultDatoSEO siteTitle={siteTitle} />
      <PageProvider value={{ district: pageProps.district, title: siteTitle }}>
        <Layout title={pageProps.pageTitle} menu={pageProps.menu || []} footer={pageProps.footer}>
          <Component {...pageProps} />
        </Layout>
      </PageProvider>
    </>
  );
}

export default App;
