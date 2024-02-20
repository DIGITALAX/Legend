import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { store } from "./../../redux/store";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  Theme,
} from "@rainbow-me/rainbowkit";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { Provider } from "react-redux";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import merge from "lodash.merge";
import Header from "@/components/Layout/modules/Header";
import Modals from "@/components/Modals/Modals";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RouterChange from "@/components/Common/modules/RouterChange";

const walletTheme = merge(darkTheme(), {
  colors: {
    accentColor: "#111313",
  },
} as Theme);

const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! })]
);

const { connectors } = getDefaultWallets({
  appName: "Cypher Search",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const client = new LitNodeClient({ litNetwork: "cayenne", debug: false });

  const [routerChangeLoading, setRouterChangeLoading] =
    useState<boolean>(false);
  useEffect(() => {
    const handleStart = () => {
      setRouterChangeLoading(true);
    };

    const handleStop = () => {
      setRouterChangeLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  if (routerChangeLoading) {
    return <RouterChange />;
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={walletTheme}>
        <Provider store={store}>
          <div className="relative w-full h-screen flex flex-col overflow-hidden">
            <Header router={router} />
            <Component {...pageProps} client={client} router={router} />
            <Modals router={router} />
          </div>
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
