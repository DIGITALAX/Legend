import { gql } from "@apollo/client";
import { graphLegendClient } from "../../../lib/graph/client";
import serializeQuery from "../../../lib/lens/helpers/serializeQuery";

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
    grantCreateds(first: 1, where: {pubId: $pubId, profileId: $profileId}) {
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

const GRANTS_BY_PROFILE = `
  query($first: Int, $skip: Int, $profileId: Int) {
    grantCreateds(first: $first, skip: $skip, where: {profileId: $profileId}) {
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

const GRANTS_BY_COLLECTION = `
  query($collectionId: Int) {
    collectionGrantIds(where: {collectionId: $collectionId}) {
      grants {
        pubId
        profileId
        uri
        grantMetadata {
          cover
          title
        }
      }
    }
  }
`;

const GRANTS_FUNDED = `
  query($funder: String, $first: Int, $skip: Int) {
    grantFundeds(where: {funder: $funder}, first: $first, skip: $skip) {
      grant {
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

export const getGrantsByCollectionId = async (
  collectionId: number
): Promise<any> => {
  const queryPromise = graphLegendClient.query({
    query: gql(GRANTS_BY_COLLECTION),
    variables: {
      collectionId,
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

export const getGrantsByProfile = async (
  first: number,
  skip: number,
  profileId: number
): Promise<any> => {
  const queryPromise = graphLegendClient.query({
    query: gql(GRANTS_BY_PROFILE),
    variables: {
      first,
      skip,
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

export const getGrantsFunded = async (
  first: number,
  skip: number,
  funder: string
): Promise<any> => {
  const queryPromise = graphLegendClient.query({
    query: gql(GRANTS_FUNDED),
    variables: {
      first,
      skip,
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

export const getGrantsByCollectionIdFilter = async (
  first: number,
  skip: number,
  where: Object
): Promise<any> => {
  const queryPromise = graphLegendClient.query({
    query: gql(`query($first: Int, $skip: Int) {
      grantCreateds(first: $first, skip: $skip, where: {${serializeQuery(
        where
      )}}) {
        levelInfo {
          collectionIds
        }
      }
    }`),
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

export const getGrantsWhere = async (
  first: number,
  skip: number,
  where: Object
): Promise<any> => {
  const queryPromise = graphLegendClient.query({
    query: gql(`query($first: Int, $skip: Int) {
      grantCreateds(first: $first, skip: $skip, where: {${serializeQuery(
        where
      )}}) {
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
    }`),
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
