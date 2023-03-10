import Document, { Html, Head, Main, NextScript } from 'next/document';
import { useRouter } from 'next/router';

export default class MyDocument extends Document {

  render() {
    //const { district: { color: { hex } } }: { district: DistrictRecord } = this.props?.__NEXT_DATA__?.props?.pageProps || {};
    const isHome = this.props.dangerousAsPath === '/'

    return (
      <Html>
        <Head />
        <body className={isHome ? 'home' : undefined}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}