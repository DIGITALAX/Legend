import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygon , polygonMumbai} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { useEffect, useState } from "react";
import { getFirebaseApp } from "../firebase.config";
import { FirebaseApp } from "firebase/app";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { store } from "./../redux/store";
import { Provider } from "react-redux";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Legend",
  chains,
});

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors,
});

export default function App({ Component, pageProps }: AppProps) {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | undefined>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFirebaseApp(getFirebaseApp());
    }
  }, []);

  return (
    <Provider store={store}>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains}>
          <div className="relative w-full h-full">
            <div className="relative w-full h-full overflow-x-hidden flex flex-col h-screen selection:bg-white selection:text-azul">
              <Header />
              <Component {...pageProps} firebaseApp={firebaseApp} />
              <Footer />
            </div>
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </Provider>
  );
}
