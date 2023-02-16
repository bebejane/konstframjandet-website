import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    const { district }: { district: DistrictRecord } = this.props?.__NEXT_DATA__?.props?.pageProps || {};

    return (
      <Html>
        <Head />
        <body style={{ backgroundColor: district?.color.hex }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}