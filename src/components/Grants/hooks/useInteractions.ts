import likePost from "../../../../graphql/mutations/like";
import { setReactBox } from "../../../../redux/reducers/reactBoxSlice";
import whoReactedPublication from "../../../../graphql/queries/whoReacted";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  CommentRankingFilterType,
  LimitType,
  PublicationReactionType,
  PublicationType,
  PublicationsOrderByType,
} from "../../../../graphql/generated";
import { useEffect, useState } from "react";
import getPublications from "../../../../graphql/queries/publications";
import { setInteractionsCount } from "../../../../redux/reducers/interactionsCountSlice";
import mirrorPost from "../../../../graphql/mutations/mirror";
import quotePost from "../../../../graphql/mutations/quote";
import commentPost from "../../../../graphql/mutations/comment";
import uploadCommentQuoteContent from "../../../../lib/lens/helpers/uploadCommentQuote";

const useInteractions = () => {
  const dispatch = useDispatch();
  const reactBox = useSelector((state: RootState) => state.app.reactBoxReducer);
  const allPublications = useSelector(
    (state: RootState) => state.app.publishedGrantsReducer.items
  );
  const interactionsCount = useSelector(
    (state: RootState) => state.app.interactionsCountReducer
  );
  const [grantComment, setGrantComment] = useState<string>("");
  const [grantQuote, setGrantQuote] = useState<string>("");
  const [interactionsLoading, setInteractionsLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      quote: boolean;
      comment: boolean;
    }[]
  >([]);

  const likeGrant = async (id: number) => {
    const index = allPublications.findIndex((pub) => pub.id === id);
    if (index === -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: true };
      return updatedArray;
    });

    try {
      await likePost({
        for: id,
        reaction: PublicationReactionType.Upvote,
      });

      dispatch(
        setInteractionsCount({
          actionLikes: interactionsCount.likes.map((obj, ind) =>
            ind === index ? obj + 1 : obj
          ),
          actionMirrors: interactionsCount.mirrors,
          actionQuotes: interactionsCount.quotes,
          actionCollects: interactionsCount.collects,
          actionComments: interactionsCount.comments,
          actionHasLiked: interactionsCount.hasLiked.map((obj, ind) =>
            ind === index ? true : obj
          ),
          actionHasMirrored: interactionsCount.hasMirrored,
          actionHasCollected: interactionsCount.hasCollected,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: true };
      return updatedArray;
    });
  };

  const mirrorGrant = async (id: number) => {
    const index = allPublications.findIndex((pub) => pub.id === id);
    if (index === -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: true };
      return updatedArray;
    });

    try {
      await mirrorPost({
        mirrorOn: id,
      });

      dispatch(
        setInteractionsCount({
          actionLikes: interactionsCount.likes,
          actionMirrors: interactionsCount.mirrors.map((obj, ind) =>
            ind === index ? obj + 1 : obj
          ),
          actionQuotes: interactionsCount.quotes,
          actionCollects: interactionsCount.collects,
          actionComments: interactionsCount.comments,
          actionHasLiked: interactionsCount.hasLiked,
          actionHasMirrored: interactionsCount.hasMirrored.map((obj, ind) =>
            ind === index ? true : obj
          ),
          actionHasCollected: interactionsCount.hasCollected,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: false };
      return updatedArray;
    });
  };

  const quoteGrant = async (id: number) => {
    const index = allPublications.findIndex((pub) => pub.id === id);
    if (index === -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], quote: true };
      return updatedArray;
    });

    try {
      const contentURI = await uploadCommentQuoteContent(grantQuote);

      await quotePost({
        contentURI,
        quoteOn: id,
      });

      dispatch(
        setInteractionsCount({
          actionLikes: interactionsCount.likes,
          actionMirrors: interactionsCount.mirrors,
          actionQuotes: interactionsCount.quotes.map((obj, ind) =>
            ind === index ? obj + 1 : obj
          ),
          actionCollects: interactionsCount.collects,
          actionComments: interactionsCount.comments,
          actionHasLiked: interactionsCount.hasLiked,
          actionHasMirrored: interactionsCount.hasMirrored.map((obj, ind) =>
            ind === index ? true : obj
          ),
          actionHasCollected: interactionsCount.hasCollected,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], quote: false };
      return updatedArray;
    });
  };

  const commentGrant = async (id: number) => {
    const index = allPublications.findIndex((pub) => pub.id === id);
    if (index === -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], comment: true };
      return updatedArray;
    });

    try {
      const contentURI = await uploadCommentQuoteContent(grantComment);

      await commentPost({
        contentURI,
        commentOn: id,
      });

      dispatch(
        setInteractionsCount({
          actionLikes: interactionsCount.likes,
          actionMirrors: interactionsCount.mirrors,
          actionQuotes: interactionsCount.quotes,
          actionCollects: interactionsCount.collects,
          actionComments: interactionsCount.comments.map((obj, ind) =>
            ind === index ? obj + 1 : obj
          ),
          actionHasLiked: interactionsCount.hasLiked,
          actionHasMirrored: interactionsCount.hasMirrored,
          actionHasCollected: interactionsCount.hasCollected,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], comment: false };
      return updatedArray;
    });
  };

  const showLikes = async (id: string) => {
    if (id === reactBox.like?.id) {
      dispatch(
        setReactBox({
          actionMirror: reactBox.mirror,
          actionQuote: reactBox.quote,
          actionLike: {
            id: "",
            cursor: undefined,
            profiles: undefined,
          },
          actionComment: reactBox.comment,
        })
      );
      return;
    } else {
      try {
        const data = await whoReactedPublication({
          for: id,
          limit: LimitType.TwentyFive,
        });

        dispatch(
          setReactBox({
            actionMirror: reactBox.mirror,
            actionQuote: reactBox.quote,
            actionLike: {
              id: id,
              cursor: data.data?.whoReactedPublication.pageInfo.next,
              profiles: data?.data?.whoReactedPublication?.items,
            },
            actionComment: reactBox.comment,
          })
        );
      } catch (err: any) {
        console.error(err.message);
      }
    }
  };

  const showComments = async (id: string) => {
    if (id === reactBox.comment?.id) {
      dispatch(
        setReactBox({
          actionMirror: reactBox.mirror,
          actionQuote: reactBox.quote,
          actionLike: reactBox.like,
          actionComment: {
            id: "",
            cursor: undefined,
            profiles: undefined,
          },
        })
      );
      return;
    } else {
      try {
        const data = await getPublications({
          limit: LimitType.Fifty,
          orderBy: PublicationsOrderByType.Latest,
          where: {
            publicationTypes: [PublicationType.Comment],
            commentOn: {
              id: id,
              commentsRankingFilter: CommentRankingFilterType.Relevant,
            },
          },
        });

        dispatch(
          setReactBox({
            actionMirror: reactBox.mirror,
            actionQuote: reactBox.quote,
            actionLike: reactBox.like,
            actionComment: {
              id: id,
              cursor: data.data?.publications.pageInfo.next,
              profiles: data?.data?.publications?.items,
            },
          })
        );
      } catch (err: any) {
        console.error(err.message);
      }
    }
  };

  const showMirrors = async (id: string) => {
    if (id === reactBox.mirror?.id) {
      dispatch(
        setReactBox({
          actionMirror: {
            id: "",
            cursor: undefined,
            profiles: undefined,
          },
          actionQuote: reactBox.quote,
          actionLike: reactBox.like,
          actionComment: reactBox.comment,
        })
      );
      return;
    } else {
      try {
        const data = await getPublications({
          limit: LimitType.Fifty,
          orderBy: PublicationsOrderByType.Latest,
          where: {
            publicationTypes: [PublicationType.Mirror],
            mirrorOn: id,
          },
        });

        dispatch(
          setReactBox({
            actionQuote: reactBox.quote,
            actionMirror: {
              id: id,
              cursor: data.data?.publications.pageInfo.next,
              profiles: data?.data?.publications?.items,
            },
            actionLike: reactBox.like,
            actionComment: reactBox.comment,
          })
        );
      } catch (err: any) {
        console.error(err.message);
      }
    }
  };

  const showQuotes = async (id: string) => {
    if (id === reactBox.quote?.id) {
      dispatch(
        setReactBox({
          actionQuote: {
            id: "",
            cursor: undefined,
            profiles: undefined,
          },
          actionMirror: reactBox.mirror,
          actionLike: reactBox.like,
          actionComment: reactBox.comment,
        })
      );
      return;
    } else {
      try {
        const data = await getPublications({
          limit: LimitType.Fifty,
          orderBy: PublicationsOrderByType.Latest,
          where: {
            publicationTypes: [PublicationType.Quote],
            quoteOn: id,
          },
        });

        dispatch(
          setReactBox({
            actionQuote: {
              id: id,
              cursor: data.data?.publications.pageInfo.next,
              profiles: data?.data?.publications?.items,
            },
            actionMirror: reactBox.mirror,
            actionLike: reactBox.like,
            actionComment: reactBox.comment,
          })
        );
      } catch (err: any) {
        console.error(err.message);
      }
    }
  };

  const showMoreLikes = async () => {
    if (!reactBox.like?.cursor) return;

    try {
      const data = await whoReactedPublication({
        for: reactBox.like.id,
        limit: LimitType.TwentyFive,
        cursor: reactBox.like?.cursor,
      });

      dispatch(
        setReactBox({
          actionMirror: reactBox.mirror,
          actionQuote: reactBox.quote,
          actionLike: {
            id: reactBox.like.id,
            cursor: data.data?.whoReactedPublication.pageInfo.next,
            profiles: [
              ...(reactBox.like.profiles || []),
              ...(data?.data?.whoReactedPublication?.items || []),
            ],
          },
          actionComment: reactBox.comment,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMoreComments = async () => {
    if (!reactBox.comment?.cursor) return;

    try {
      const data = await getPublications({
        limit: LimitType.Fifty,
        orderBy: PublicationsOrderByType.Latest,
        cursor: reactBox?.comment?.cursor,
        where: {
          publicationTypes: [PublicationType.Comment],
          commentOn: {
            id: reactBox?.comment?.id,
            commentsRankingFilter: CommentRankingFilterType.Relevant,
          },
        },
      });

      dispatch(
        setReactBox({
          actionMirror: reactBox.mirror,
          actionLike: reactBox.like,
          actionQuote: reactBox.quote,
          actionComment: {
            id: reactBox?.comment?.id,
            cursor: data.data?.publications.pageInfo.next,
            profiles: [
              ...(reactBox?.comment?.profiles || []),
              ...(data?.data?.publications?.items || []),
            ],
          },
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMoreMirrors = async () => {
    if (!reactBox.mirror?.cursor) return;

    try {
      const data = await getPublications({
        limit: LimitType.Fifty,
        orderBy: PublicationsOrderByType.Latest,
        where: {
          publicationTypes: [PublicationType.Mirror],
          mirrorOn: reactBox.mirror.id,
        },
        cursor: reactBox.mirror.cursor,
      });

      dispatch(
        setReactBox({
          actionQuote: reactBox.quote,
          actionMirror: {
            id: reactBox.mirror.id,
            cursor: data.data?.publications.pageInfo.next,
            profiles: [
              ...(reactBox.mirror.profiles || []),
              ...(data?.data?.publications?.items || []),
            ],
          },
          actionLike: reactBox.like,
          actionComment: reactBox.comment,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMoreQuotes = async () => {
    if (!reactBox.quote?.cursor) return;

    try {
      const data = await getPublications({
        limit: LimitType.Fifty,
        orderBy: PublicationsOrderByType.Latest,
        where: {
          publicationTypes: [PublicationType.Mirror],
          quoteOn: reactBox.quote.id,
        },
        cursor: reactBox.quote.cursor,
      });

      dispatch(
        setReactBox({
          actionMirror: reactBox.mirror,
          actionQuote: {
            id: reactBox.quote.id,
            cursor: data.data?.publications.pageInfo.next,
            profiles: [
              ...(reactBox.quote.profiles || []),
              ...(data?.data?.publications?.items || []),
            ],
          },
          actionLike: reactBox.like,
          actionComment: reactBox.comment,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (allPublications.length > 0) {
      setInteractionsLoading(
        Array.from({ length: allPublications.length }, () => ({
          like: false,
          mirror: false,
          comment: false,
          quote: false,
        }))
      );
    }
  }, [allPublications.length]);

  return {
    commentGrant,
    likeGrant,
    mirrorGrant,
    quoteGrant,
    showComments,
    showLikes,
    showMirrors,
    showQuotes,
    showMoreComments,
    showMoreLikes,
    showMoreMirrors,
    showMoreQuotes,
    interactionsLoading,
    grantComment,
    setGrantComment,
    grantQuote,
    setGrantQuote,
  };
};

export default useInteractions;
