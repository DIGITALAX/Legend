import { useEffect, useState } from "react";
import actOnGrant from "../../../../graphql/lens/mutations/actOn";
import { ethers } from "ethers";
import { CartItem, Fulfillment } from "../types/checkout.types";
import { COLLECT_LEVEL_ABI } from "../../../../lib/constants";
import * as LitJsSDK from "@lit-protocol/lit-node-client";
import { AccessControlConditions } from "@lit-protocol/types";

const useCheckout = (
  cartItems: CartItem[],
  litNodeClient: LitJsSDK.LitNodeClient,
  address: `0x${string}` | undefined
) => {
  const [grantCheckoutLoading, setGrantCheckoutLoading] = useState<boolean[]>(
    []
  );
  const [chosenCurrency, setChosenCurrency] = useState<string>();
  const [fulfillmentLoading, setFulfillmentLoading] = useState<boolean>(false);
  const [fulfillment, setFulfillment] = useState<Fulfillment>({
    number: "",
    street: "",
    state: "",
    country: "",
    zip: "",
    name: "",
  });
  const [encryptedFulfillment, setEncryptedFulfillment] = useState<string>("");
  const [itemCheckedOut, setItemCheckedOut] = useState<boolean[]>([]);

  const handleEncryptFulfillment = async () => {
    setFulfillmentLoading(true);
    try {
      await litNodeClient.connect();
      let nonce = litNodeClient.getLatestBlockhash();

      const authSig = await LitJsSDK.checkAndSignAuthMessage({
        chain: "polygon",
        nonce: nonce!,
      });

      const accessControlConditions = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: "polygon",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: address,
          },
        },
        {
          operator: "or",
        },
        {
          contractAddress: CREATOR ADDRESSES HERE FOR EVERY ITEM + FULFILLER ADDRESS HERE FOR EACH ITEM!!,
          standardContractType: "ERC721",
          chain: 137,
          method: "balanceOf",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: ">",
            value: "0",
          },
        },
      ];
      const { ciphertext, dataToEncryptHash } = await LitJsSDK.encryptString(
        {
          accessControlConditions:
            accessControlConditions as AccessControlConditions,
          authSig,
          chain: "polygon",
          dataToEncrypt: JSON.stringify(fulfillment),
        },
        litNodeClient! as any
      );

      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify({
          ciphertext,
          dataToEncryptHash,
          accessControlConditions,
        }),
      });
      let responseJSON = await response.json();
      setEncryptedFulfillment("ipfs://" + responseJSON?.cid);
    } catch (err: any) {
      console.error(err.message);
    }
    setFulfillmentLoading(false);
  };

  const handleCheckout = async (item: CartItem) => {
    const index = cartItems.findIndex(
      (pub) => pub.collectionId === item.collectionId
    );
    if (index === -1) {
      return;
    }
    setGrantCheckoutLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = true;
      return updatedArray;
    });

    try {
      const encodedData = ethers.utils.defaultAbiCoder.encode(
        COLLECT_LEVEL_ABI as any,
        [chosenCurrency, item.level, encryptedFulfillment]
      );

      await actOnGrant({
        actOn: {
          unknownOpenAction: {
            address: address,
            data: encodedData,
          },
        },
        for: item.collectionId, // collection or pub id??
      });
      setItemCheckedOut((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = true;
        return updatedArray;
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setGrantCheckoutLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = false;
      return updatedArray;
    });
  };

  useEffect(() => {
    if (cartItems?.length > 0) {
      setGrantCheckoutLoading(
        Array.from({ length: cartItems.length }, () => false)
      );
      setItemCheckedOut(Array.from({ length: cartItems.length }, () => false));
    }
  }, [cartItems]);

  return {
    handleCheckout,
    grantCheckoutLoading,
    itemCheckedOut,
    fulfillment,
    setFulfillment,
    handleEncryptFulfillment,
    encryptedFulfillment,
    fulfillmentLoading,
    chosenCurrency,
    setChosenCurrency,
  };
};

export default useCheckout;
