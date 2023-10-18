import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLinkLegend = new HttpLink({
  uri: "https://api.studio.thegraph.com/query/37770/legend_draft/version/latest",
});

export const graphLegendClient = new ApolloClient({
  link: httpLinkLegend,
  cache: new InMemoryCache(),
});

const httpLinkPrint = new HttpLink({
  uri: "https://api.studio.thegraph.com/query/37770/print_library_draft/version/latest",
});

export const graphPrintClient = new ApolloClient({
  link: httpLinkPrint,
  cache: new InMemoryCache(),
});
