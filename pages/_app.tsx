import '/lib/styles/index.scss'
import { useRouter } from 'next/router';
import { sv } from 'date-fns/locale'

import setDefaultOptions from 'date-fns/setDefaultOptions';
setDefaultOptions({ locale: sv })

function App({ Component, pageProps }) {

  const router = useRouter()

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default App;
