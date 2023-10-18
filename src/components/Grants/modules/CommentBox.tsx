import Bar from "@/components/Common/modules/Bar";
import { FunctionComponent } from "react";
import Draggable from "react-draggable";
import { CommentBoxProps } from "../types/grant.types";

const CommentBox: FunctionComponent<CommentBoxProps> = (): JSX.Element => {
  return (
    <Draggable>
      <div
        className="fixed z-20 right-12 w-60 h-48 top-40 overflow-y-scroll flex flex-col cursor-grab active:cursor-grabbing"
        id="milestone"
      >
        <Bar title="Comments" />
        <div className="relative w-full h-full bg-offWhite flex flex-col p-2"></div>
      </div>
    </Draggable>
  );
};

export default CommentBox;
