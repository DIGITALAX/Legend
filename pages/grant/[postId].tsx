import { NextPage } from "next";
import { BASE_URL } from "../../lib/constants";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  getGrantDetails,
  getAllGrants,
} from "@/graphql/subgraph/query/getAllGrants";

export const getStaticPaths = async () => {
  const data = await getAllGrants();
  if (
    !data ||
    data?.data?.collectionMinteds?.length < 1 ||
    !data?.data?.collectionMinteds
  ) {
    return;
  }

  const paths = data?.data?.collectionMinteds?.map((item: any) => {
    return {
      params: {
        postId: item.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async (context: any) => {
  const postId: string = context.params.postId;
  const response = await getGrantDetails();
  // get lens post information here too on await and concatonate 
  const data = await response.json();
  return {
    props: { item: data },
    revalidate: 30,
  };
};

const PostId: NextPage<any> = ({ item }): JSX.Element => {
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(
    //   setCurrency({
    //     actionSlug: item?.slug,
    //   })
    // );
    // dispatch(setMain(item?.mainImage as string));
    // dispatch(setFeatured(item?.featuredImages as string[]));
  }, []);

  console.log(item);

  return (
    <div className="relative h-full w-full bg-black grid grid-flow-row auto-rows-[auto auto] overflow-hidden"></div>
  );
};

export default PostId;
