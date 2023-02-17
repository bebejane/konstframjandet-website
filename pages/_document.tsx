import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    const { district }: { district: DistrictRecord } = this.props?.__NEXT_DATA__?.props?.pageProps || {};
    const { red, green, blue } = district.color

    return (
      <Html>
        <Head />
        <body style={{ backgroundColor: `rgb(${red},${green},${blue})` }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}