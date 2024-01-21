import { COVER_CONSTANTS } from "../../constants";

const getRandomElement = (): string[] => {
  const indices = new Set<number>();
  while (indices.size < 3) {
    indices.add(Math.floor(Math.random() * COVER_CONSTANTS.length));
  }
  const indicesArray = Array.from(indices);
  return indicesArray.map((index: number) => COVER_CONSTANTS[index]);
};

export default getRandomElement;
