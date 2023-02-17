import '/lib/styles/index.scss'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { sv } from 'date-fns/locale'

import setDefaultOptions from 'date-fns/setDefaultOptions';
setDefaultOptions({ locale: sv })

function App({ Component, pageProps }) {

  const router = useRouter()
  const { district } = pageProps

  useEffect(() => {
    const { red, green, blue } = district.color
    document.body.style.backgroundColor = `rgb(${red},${green},${blue})`
  }, [])

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default App;
