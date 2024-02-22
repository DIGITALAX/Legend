import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLinkLegend = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/digitalax/legend",
});

export const graphLegendClient = new ApolloClient({
  link: httpLinkLegend,
  cache: new InMemoryCache(),
});

const httpLinkPrint = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/digitalax/print-library",
});

export const graphPrintClient = new ApolloClient({
  link: httpLinkPrint,
  cache: new InMemoryCache(),
});
