import { PostInformation } from "@/components/Launch/types/launch.types";
import { v4 as uuidv4 } from "uuid";
import { PublicationMetadataMainFocusType } from "../../../graphql/generated";

const uploadPostContent = async (
  postInformation: PostInformation
): Promise<
  | {
      grantURI: string;
      postURI: string;
    }
  | undefined
> => {
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

  const formattedText: string = postInformation.description;

  const data = {
    $schema: "https://json-schemas.lens.dev/publications/image/3.0.0.json",
    lens: {
      mainContentFocus: PublicationMetadataMainFocusType.Image,
      image: newImages[0],
      title: postInformation.title,
      content: formattedText,
      attachments: newImages?.slice(1),
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

    const grantResponse = await fetch("/api/ipfs", {
      method: "POST",
      body: JSON.stringify({
        title: postInformation.title,
        description: postInformation.description,
        team: postInformation.team,
        tech: postInformation.tech,
        strategy: postInformation.strategy,
        cover: "ipfs://" + postInformation.coverImage,
        experience: postInformation.experience,
        milestones: postInformation.milestones.map((mil) => ({
          description: mil.description,
          cover: "ipfs://" + mil.image,
        })),
      }),
    });
    if (response.status === 200 && grantResponse.status === 200) {
      let responseJSON = await response.json();
      let grantJSON = await grantResponse.json();
      return {
        grantURI: "ipfs://" + grantJSON.cid,
        postURI: "ipfs://" + responseJSON.cid,
      };
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default uploadPostContent;
