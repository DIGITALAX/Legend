import { INFURA_GATEWAY } from "../../constants";

const fetchIpfsJson = async (uri: string) => {
  const response = await fetch(`${INFURA_GATEWAY}/ipfs/${uri}`);
  const json = await response.json();
  return json;
};

export default fetchIpfsJson;
