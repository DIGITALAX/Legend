import { PrintItem } from "@/components/Launch/types/launch.types";

const pickRandomItem = (
  collection: PrintItem[],
  usedItemIds: Set<string>
): PrintItem => {
  let candidate: PrintItem;
  do {
    const randomIndex = Math.floor(Math.random() * collection.length);
    candidate = collection?.[randomIndex];
  } while (usedItemIds.has(candidate.collectionId));

  usedItemIds.add(candidate.collectionId);
  return candidate;
};

export default pickRandomItem;
