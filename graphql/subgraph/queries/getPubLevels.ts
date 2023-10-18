import { gql } from "@apollo/client";
import { graphLegendClient } from "../../../lib/graph/client";

const LEVELS = `
  query {
    levelsAddeds {
        levelFive
        levelFour
        levelSeven
        levelSix
        levelThree
        levelTwo
        profileId
        pubId
    }
  }
`;

export const getPubLevels = async (): Promise<any> => {
  const queryPromise = graphLegendClient.query({
    query: gql(LEVELS),
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
