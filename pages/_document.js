import Document, { Html, Head, Main, NextScript } from "next/document";
import Link from "next/link";
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <div className="text-primary">
            <Main />
          </div>

          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
