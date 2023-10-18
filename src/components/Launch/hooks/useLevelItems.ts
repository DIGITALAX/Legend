import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const useLevelItems = () => {
  const dispatch = useDispatch();
  const allCollections = useSelector(
    (state: RootState) => state.app.availableCollectionsReducer.collections
  );
  const [allCollectionsLoading, setAllCollectionsLoading] =
    useState<boolean>(false);
  const [priceIndex, setPriceIndex] = useState<number[][]>([]);

  const getAllAvailableCollections = async () => {
    setAllCollectionsLoading(true);
    try {


        handleShuffleCollectionLevels();
    } catch (err: any) {
      console.error(err.message);
    }
    setAllCollectionsLoading(false);
  };

  const handleShuffleCollectionLevels = () => {
    // slice 6 from the shuffle collections
  };

  useEffect(() => {
    if (allCollections.length < 1) {
      getAllAvailableCollections();
    }
  }, []);

  return {
    allCollectionsLoading,
    priceIndex,
    setPriceIndex,
    handleShuffleCollectionLevels,
  };
};

export default useLevelItems;
