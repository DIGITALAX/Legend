import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/digitalax/legend",
});

export const graphClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const httpLinkDash = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/digitalax/legend_testnet",
});

export const graphClientDash = new ApolloClient({
  link: httpLinkDash,
  cache: new InMemoryCache(),
});
