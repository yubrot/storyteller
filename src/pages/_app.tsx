import '../globals.css';
import '../loaders/file';
import '../loaders/github';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>storyteller</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
