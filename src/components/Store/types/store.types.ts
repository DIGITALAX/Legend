export type FilterProps = {
  searchFilters: {
    printType: string[];
    timestamp: string;
    grant: string;
    profile: string;
    amount: {
      min: number;
      max: number;
    };
  };
  setSearchFilters: (e: {
    printType: string[];
    timestamp: string;
    grant: string;
    profile: string;
    amount: {
      min: number;
      max: number;
    };
  }) => void;
};

export type ItemProps = {
  grant: {
    id: string;
    image: string;
    profileImage: string;
    name: string;
    apparelName: string;
  };
};
