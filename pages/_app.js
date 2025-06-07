import Head from 'next/head';
import "@/styles/globals.css";
import { useState } from 'react';

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState('default'); // 'default' or 'aquarium'

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'default' ? 'aquarium' : 'default'));
  };

  return (
    <>
      <Head>
        <title>Marine Research Hub</title>
      </Head>
      <div className={theme === 'aquarium' ? 'aquarium-theme' : ''}>
        <button
          onClick={toggleTheme}
          className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {theme === 'default' ? 'Switch to Aquarium Theme' : 'Switch to Default Theme'}
        </button>
        <Component {...pageProps} />
      </div>
    </>
  );
}
