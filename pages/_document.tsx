import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="og:url" content="https://legend.irrevocable.xyz/" />
        <meta name="og:title" content="Legend" />
        <meta name="og:description" content="" />
        <meta
          name="og:image"
          content="https://legend.irrevocable.xyz/card.png/"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="og:url" content="https://legend.irrevocable.xyz/" />
        <meta
          name="og:image"
          content="https://legend.irrevocable.xyz/card.png/"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@digitalax_" />
        <meta name="twitter:creator" content="@digitalax_" />
        <meta
          name="twitter:image"
          content="https://legend.irrevocable.xyz/card.png/"
        />
        <meta name="twitter:url" content="https://legend.irrevocable.xyz/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="canonical" href="https://legend.irrevocable.xyz/" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/vcr.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/EarlsRevenge.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/MegamaxJones.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: "VCR";
                font-weight: 400;
                src: url("./fonts/vcr.ttf");
              }

              @font-face {
                font-family: "Earls Revenge";
                font-weight: 400;
                src: url("./fonts/EarlsRevenge.ttf");
              }

              @font-face {
                font-family: "Megamax Jones";
                font-weight: 400;
                src: url("./fonts/MegamaxJones.ttf");
              }
            `,
          }}
        ></style>
      </Head>
      <body>
        <script>0</script>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
