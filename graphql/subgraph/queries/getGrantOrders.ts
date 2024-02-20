import { gql } from "@apollo/client";
import { graphLegendClient } from "../../../lib/graph/client";

const GRANT_ORDERS = `
  query($funder: String) {
    grantOrders(where: {funder: $funder}, orderBy: blockTimestamp, orderDirection: desc) {
      currency
      grantId
      orderId
      encryptedFulfillment
      amount
      blockTimestamp
      transactionHash
      level
      orderCollections {
        collectionMetadata {
            sizes
            colors
            images
            title
          }
          prices
          printType
      }
      grant {
        grantMetadata {
            cover
            description
            experience
            strategy
            milestones
            team
            tech
            title
          }
          fundedAmount {
            currency
            funded
          }
          granteeAddresses
          splits
          uri
          profileId
          milestones {
            allClaimed
            status
            submitBy
            granteeClaimed
            currencyGoal {
              currency
              amount
            }
          }
          levelInfo {
            amounts
            collectionIds
            level
          }
          acceptedCurrencies
          blockTimestamp
          blockNumber
      }
      
    }
  }
`;

export const getGrantOrders = async (funder: string): Promise<any> => {
  const queryPromise = graphLegendClient.query({
    query: gql(GRANT_ORDERS),
    variables: {
      funder,
    },
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
