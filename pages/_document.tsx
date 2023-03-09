import Document, { Html, Head, Main, NextScript } from 'next/document';
import { useRouter } from 'next/router';
//import {}

export default class MyDocument extends Document {
  render() {
    const { district }: { district: DistrictRecord } = this.props?.__NEXT_DATA__?.props?.pageProps || {};

    return (
      <Html>
        <Head />
        <body >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}