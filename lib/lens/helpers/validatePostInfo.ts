import { PostInformation } from "@/components/Launch/types/launch.types";

const validateObject = (obj: PostInformation): boolean => {
  const areBasicFieldsFilled = [
    "title",
    "description",
    "coverImage",
    "tech",
    "strategy",
    "experience",
    "team",
  ].every((field) => {
    const value = obj[field as keyof PostInformation];
    return typeof value === "string" && value.trim() !== "";
  });

  const areArraysSameLength = obj.grantees.length === obj.splits.length;

  const doSplitsSumToOneHundred =
    obj.splits.reduce((acc, val) => acc + val, 0) === 100;

  const areMilestonesValid = obj.milestones.every(
    (milestone) =>
      milestone.description.trim() !== "" &&
      milestone.amount > 0 &&
      milestone.submit.trim() !== "" &&
      milestone.image.trim() !== ""
  );

  return (
    areBasicFieldsFilled &&
    areArraysSameLength &&
    doSplitsSumToOneHundred &&
    areMilestonesValid
  );
};

export default validateObject;
