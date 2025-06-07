import Head from 'next/head';
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Marine Research Hub</title> {/* Change this to your desired title */}
      </Head>
      <Component {...pageProps} />
    </>
  );
}
