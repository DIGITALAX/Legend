import { gql } from "@apollo/client";
import { graphLegendClient } from "../../../lib/graph/client";

const LEVELS = `
  query($first: Int, $skip: Int) {
    grantCreateds(first: $first, skip: $skip) {
      grantId
      creator
      pubId
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
`;

const GRANT = `
  query($pubId: Int, $profileId: Int) {
    grantCreateds(first: 1, pubId: $pubId, profileId: $profileId) {
      grantId
      creator
      pubId
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
`;

export const getAllGrants = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphLegendClient.query({
    query: gql(LEVELS),
    variables: {
      first,
      skip,
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

export const getGrant = async (
  pubId: number,
  profileId: number
): Promise<any> => {
  const queryPromise = graphLegendClient.query({
    query: gql(GRANT),
    variables: {
      pubId,
      profileId,
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
