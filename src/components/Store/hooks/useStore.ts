import { useState } from "react";

const useStore = () => {
  const [searchFilters, setSearchFilters] = useState<{
    printType: string[];
    timestamp: string;
    grant: string;
    profile: string;

    amount: {
      min: number;
      max: number;
    };
  }>({
    printType: [],
    timestamp: "latest",
    grant: "",
    profile: "",
    amount: {
      min: 10,
      max: 50,
    },
  });

  return {
    searchFilters,
    setSearchFilters,
  };
};

export default useStore;
