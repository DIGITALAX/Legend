import { gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const ORACLE = `
  query {
    oracleUpdateds {
        currency
        rate
        wei
      }
  }
`;

export const getOracleData = async (): Promise<any> => {
  const queryPromise = graphPrintClient.query({
    query: gql(ORACLE),
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
