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

const walletTheme = merge(darkTheme(), {
  colors: {
    accentColor: "#111313",
  },
} as Theme);

const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! })]
);
const client = new LitNodeClient({ litNetwork: "cayenne", debug: false });

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
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={walletTheme}>
        <Provider store={store}>
          <div className="relative w-full h-screen flex flex-col overflow-hidden">
            <Header />
            <Component {...pageProps} client={client} />
            <Modals />
          </div>
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
