import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="og:url" content={`https://legend.irrevocable.dev/`} />
        <meta name="og:title" content={"Legend"} />
        <meta
          name="og:description"
          content={"Peer-2-Peer Commerce based Grants."}
        />
        <meta
          name="og:image"
          content={"https://legend.irrevocable.dev/card.png/"}
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@digitalax" />
        <meta name="twitter:creator" content="@digitalax" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="og:image"
          content={"https://legend.irrevocable.dev/card.png/"}
        />
        <meta name="twitter:url" content={`https://legend.irrevocable.dev/`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="canonical"
          content={"https://legend.irrevocable.dev/card.png/"}
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://legend.irrevocable.dev/fonts/Dogica.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://legend.irrevocable.dev/fonts/Vcr.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://legend.irrevocable.dev/fonts/Network.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://legend.irrevocable.dev/fonts/Gamer.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
