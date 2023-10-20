import { PrintItem } from "@/components/Launch/types/launch.types";

const pickRandomItem = (collection: PrintItem[]): PrintItem => {
  let candidate: PrintItem;
  const randomIndex = Math.floor(Math.random() * collection.length);
  candidate = collection?.[randomIndex];
  return candidate;
};

export default pickRandomItem;
