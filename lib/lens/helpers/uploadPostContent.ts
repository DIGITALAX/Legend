import { PostInformation } from "@/components/Launch/types/launch.types";
import { v4 as uuidv4 } from "uuid";
import { PublicationMetadataMainFocusType } from "../../../graphql/generated";

const uploadPostContent = async (
  postInformation: PostInformation
): Promise<string | undefined> => {
  let newImages: { item: string; type: string }[] = [];
  [
    postInformation.coverImage,
    ...postInformation.milestones.map((item) => item.image),
  ]?.forEach((image) => {
    newImages.push({
      item: "ipfs://" + image,
      type: "image/png",
    });
  });

  const formattedText: string = `
  ${postInformation.title}
  \n\n
  ${postInformation.description}
  \n\n
  ${postInformation.strategy}
  \n\n
  ${postInformation.tech}
  \n\n
  ${postInformation.team}
  \n\n
  ${postInformation.experience}
  \n\n
  ${postInformation.milestones
    .map((milestone, index) => {
      return `Milestone ${index + 1}
    ${milestone.description}\n\n${milestone.amount}\n\n${milestone.submit}\n\n`;
    })
    .join("\n\n")}
  `;

  const data = {
    $schema: "https://json-schemas.lens.dev/publications/image/3.0.0.json",
    lens: {
      mainContentFocus: PublicationMetadataMainFocusType.Image,
      image: newImages[0],
      title: postInformation.title,
      content: formattedText,
      attachments: newImages,
      appId: "legend",
      id: uuidv4(),
      hideFromFeed: false,
      locale: "en",
      tags: ["legend", "legendgrant"],
    },
  };

  try {
    const response = await fetch("/api/ipfs", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.status === 200) {
      let responseJSON = await response.json();
      return "ipfs://" + responseJSON.cid;
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default uploadPostContent;
