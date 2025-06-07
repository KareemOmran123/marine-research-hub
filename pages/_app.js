import Head from 'next/head';
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Marine Research Hub</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
