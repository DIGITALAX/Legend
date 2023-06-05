import { FormEvent, useEffect, useState } from "react";
import { Collection } from "../types/launch.types";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { AVAILABLE_TOKENS, LEGEND_COLLECTION_MUMBAI } from "@/lib/constants";
import { waitForTransaction } from "@wagmi/core";
import LegendCollectionAbi from "./../../../abi/LegendCollection.json";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setStorefrontValues } from "@/redux/reducers/storefrontValuesSlice";

const useStorefront = () => {
  const dispatch = useDispatch();
  const postValues = useSelector(
    (state: RootState) => state.app.postValuesReducer.value
  );
  const storefrontValues = useSelector(
    (state: RootState) => state.app.storefrontValuesReducer.value
  );
  const [productInformation, setProductInformation] = useState<Collection[]>(
    Array.from({ length: 3 }, () => ({
      acceptedTokens: [],
      basePrices: [],
      grantOnly: false,
      discount: 0,
      printType: "apparel",
      uri: {
        description: "",
        external_url: "",
        image: "",
        name: "",
        type: "",
      },
      amount: postValues.editionAmount,
    }))
  );
  const [imageLoading, setImageLoading] = useState<boolean[]>(
    Array.from({ length: productInformation.length }, () => false)
  );
  const [collectionLoading, setCollectionLoading] = useState<boolean[]>(
    Array.from({ length: productInformation.length }, () => false)
  );
  const [minted, setMinted] = useState<boolean[]>(
    Array.from({ length: productInformation.length }, () => false)
  );
  const [mint, setMint] = useState<number>();
  const [args, setArgs] = useState<any>();
  const [newPosition, setNewPosition] = useState<
    {
      x: string;
      y: string;
    }[]
  >([]);

  const { config } = usePrepareContractWrite({
    address: LEGEND_COLLECTION_MUMBAI,
    abi: LegendCollectionAbi,
    functionName: "mintCollection",
    enabled: Boolean(args),
    args: args,
  });

  const { writeAsync } = useContractWrite(config);

  const handleCollectionPrices = (
    e: FormEvent,
    address: string,
    index: number
  ): void => {
    const updatedProductInformation = [...productInformation];
    const product = { ...updatedProductInformation[index] };

    const value = (e.target as HTMLFormElement).value;
    const formattedValue = value === "" ? "" : Number(value).toFixed(2);

    const tokenIndex = (
      product?.acceptedTokens?.length > 0 ? product.acceptedTokens : []
    )?.findIndex(
      (token: string) => token.toLowerCase() === address.toLowerCase()
    );

    if (formattedValue === "") {
      if (tokenIndex !== -1) {
        product.acceptedTokens?.splice(tokenIndex, 1);
        product.basePrices?.splice(tokenIndex, 1);
      }
    } else {
      if (tokenIndex === -1) {
        product.acceptedTokens.push(address);
        product.basePrices.push(Number(formattedValue));
      } else {
        product.basePrices[tokenIndex] = Number(formattedValue);
      }
    }

    updatedProductInformation[index] = product;
    setProductInformation(updatedProductInformation);
  };

  const handleTitle = (e: FormEvent, index: number) => {
    const updatedProductInformation = [...productInformation];

    updatedProductInformation[index] = {
      ...updatedProductInformation[index],
      uri: {
        ...updatedProductInformation[index]?.uri,
        name: (e.target as HTMLFormElement).value,
      },
    };

    setProductInformation(updatedProductInformation);
  };

  const handleGrantOnly = (e: FormEvent, index: number) => {
    const updatedProductInformation = [...productInformation];

    updatedProductInformation[index] = {
      ...updatedProductInformation[index],
      grantOnly:
        updatedProductInformation[index].grantOnly === true ? false : true,
    };

    setProductInformation(updatedProductInformation);
  };

  const handlePrintType = (e: FormEvent, index: number) => {
    const updatedProductInformation = [...productInformation];

    updatedProductInformation[index] = {
      ...updatedProductInformation[index],
      printType: (e.target as HTMLFormElement).value,
    };

    setProductInformation(updatedProductInformation);
  };

  const handleDiscount = (e: FormEvent, index: number) => {
    const updatedProductInformation = [...productInformation];

    updatedProductInformation[index] = {
      ...updatedProductInformation[index],
      discount: (e.target as HTMLFormElement).value,
    };

    setProductInformation(updatedProductInformation);
  };

  const handleDescription = (e: FormEvent, index: number) => {
    const updatedProductInformation = [...productInformation];

    updatedProductInformation[index] = {
      ...updatedProductInformation[index],
      uri: {
        ...updatedProductInformation[index].uri,
        description: (e.target as HTMLFormElement).value,
      },
    };

    setProductInformation(updatedProductInformation);
  };

  const handleEditionAmount = (e: FormEvent, index: number) => {
    const updatedProductInformation = [...productInformation];

    updatedProductInformation[index] = {
      ...updatedProductInformation[index],
      amount: (e.target as HTMLFormElement).value,
    };

    setProductInformation(updatedProductInformation);
  };

  const handleImageUpload = async (
    e: FormEvent,
    index: number
  ): Promise<void> => {
    setImageLoading(
      [...imageLoading].map((value, i) => (i === index ? true : value))
    );

    try {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: (e as any).target.files[0],
      });
      if (response.status !== 200) {
        setImageLoading(
          [...imageLoading].map((value, i) => (i === index ? false : value))
        );
      } else {
        let cid = await response.json();

        const updatedProductInformation = [...productInformation];

        updatedProductInformation[index] = {
          ...updatedProductInformation[index],
          uri: {
            ...updatedProductInformation[index].uri,
            image: String(cid?.cid),
            external_url: "www.legend.irrevocable.xyz",
            type: "image/png",
          },
        };

        setProductInformation(updatedProductInformation);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setImageLoading(
      [...imageLoading].map((value, i) => (i === index ? false : value))
    );
  };

  const mintCollection = async (index: number) => {
    setCollectionLoading(
      [...imageLoading].map((value, i) => (i === index ? true : value))
    );
    try {
      setMint(index);
      const uri = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify(productInformation[index].uri),
      });
      setArgs([
        productInformation[index].amount,
        {
          acceptedTokens: productInformation[index].acceptedTokens,
          basePrices: productInformation[index].basePrices,
          uri,
          printType: productInformation[index].printType,
          fulfillerId: 1,
          discount: productInformation[index].discount,
          grantCollectorsOnly: productInformation[index].grantOnly,
        },
        postValues.title,
      ]);
    } catch (err: any) {
      setCollectionLoading(
        [...imageLoading].map((value, i) => (i === index ? false : value))
      );
      console.error(err.message);
    }
    setCollectionLoading(
      [...imageLoading].map((value, i) => (i === index ? false : value))
    );
  };

  const mintWrite = async (index: number) => {
    setCollectionLoading(
      [...imageLoading].map((value, i) => (i === index ? true : value))
    );
    try {
      const tx = await writeAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      setArgs(undefined);
      setMinted([...minted].map((value, i) => (i === index ? true : value)));
      dispatch(
        setStorefrontValues([...storefrontValues, productInformation[index]])
      );
    } catch (err: any) {
      setCollectionLoading(
        [...imageLoading].map((value, i) => (i === index ? false : value))
      );
      console.error(err.message);
    }
    setCollectionLoading(
      [...imageLoading].map((value, i) => (i === index ? false : value))
    );
  };

  useEffect(() => {
    if (newPosition.length > 0) {
      setProductInformation([
        ...productInformation,
        {
          acceptedTokens: [],
          basePrices: [],
          grantOnly: false,
          discount: 0,
          printType: "apparel",
          uri: {
            description: "",
            external_url: "",
            image: "",
            name: "",
            type: "",
          },
          amount: 0,
        },
      ]);
      setImageLoading([...imageLoading, false]);
      setCollectionLoading([...collectionLoading, false]);
      setMinted([...minted, false]);
    }
  }, [newPosition]);

  useEffect(() => {
    if (args) {
      mintWrite(mint as number);
    }
  }, [args]);

  return {
    productInformation,
    newPosition,
    setNewPosition,
    handleCollectionPrices,
    handleDescription,
    handleTitle,
    handleEditionAmount,
    imageLoading,
    handleImageUpload,
    minted,
    mintCollection,
    collectionLoading,
    handleDiscount,
    handlePrintType,
    handleGrantOnly,
  };
};

export default useStorefront;
