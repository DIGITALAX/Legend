import { FunctionComponent } from "react";
import { IndexProps } from "../types/modals.types";

const Index: FunctionComponent<IndexProps> = ({ message }): JSX.Element => {
  return (
    <div className="fixed bottom-5 right-5 w-fit h-fit z-50">
      <div className="w-fit h-10 sm:h-16 flex items-center justify-center border border-lima bg-mar/75 rounded-md">
        <div className="relative w-fit h-fit flex items-center justify-center px-4 py-2 text-xs text-white font-vcr top-px">
          {message}
        </div>
      </div>
    </div>
  );
};

export default Index;
