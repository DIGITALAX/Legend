import { useEffect, useState } from "react";
import actOnGrant from "../../../../graphql/lens/mutations/actOn";
import { ethers } from "ethers";
import { CartItem, Fulfillment } from "../types/checkout.types";
import { COLLECT_LEVEL_ABI } from "../../../../lib/constants";
import * as LitJsSDK from "@lit-protocol/lit-node-client";
import { AccessControlConditions } from "@lit-protocol/types";
import { PrintItem } from "@/components/Launch/types/launch.types";
import { Grant } from "@/components/Grants/types/grant.types";

const useCheckout = (
  cartItems: CartItem[],
  litNodeClient: LitJsSDK.LitNodeClient,
  address: `0x${string}` | undefined,
  allGrants: Grant[]
) => {
  const [grantCheckoutLoading, setGrantCheckoutLoading] = useState<boolean[]>(
    []
  );
  const [simpleCheckoutLoading, setSimpleCheckoutLoading] = useState<boolean[]>(
    []
  );
  const [chosenCurrency, setChosenCurrency] = useState<string>();
  const [fulfillmentLoading, setFulfillmentLoading] = useState<boolean>(false);
  const [chosenCartItem, setChosenCartItem] = useState<CartItem>(
    cartItems?.[0]
  );
  const [fulfillment, setFulfillment] = useState<Fulfillment>({
    number: "",
    street: "",
    state: "",
    country: "",
    zip: "",
    name: "",
  });
  const [encryptedFulfillment, setEncryptedFulfillment] = useState<string>("");

  const handleEncryptFulfillment = async () => {
    setFulfillmentLoading(true);
    try {
      await litNodeClient.connect();
      let nonce = litNodeClient.getLatestBlockhash();

      const authSig = await LitJsSDK.checkAndSignAuthMessage({
        chain: "polygon",
        nonce: nonce!,
      });

      let accessControlConditions: any[] = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: "polygon",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: address?.toLowerCase(),
          },
        },
      ];

      chosenCartItem?.chosenLevel.collectionIds?.map((item: PrintItem) => {
        accessControlConditions.push({
          operator: "or",
        });
        accessControlConditions.push({
          contractAddress: "",
          standardContractType: "",
          chain: "polygon",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: item.owner.toLowerCase(),
          },
        });
      });

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
    if (
      (!encryptedFulfillment || encryptedFulfillment == "") &&
      item.chosenLevel.level !== 1
    ) {
      return;
    }
    if (item.chosenLevel.level == 1) {
      const index = allGrants.findIndex(
        (pub) => pub.publication?.id == item.grant.publication?.id
      );

      setSimpleCheckoutLoading((prev) => {
        const arr = [...prev];
        arr[index] = true;

        return arr;
      });
    } else {
      const index = cartItems.findIndex(
        (pub) => pub.grant.publication?.id == item.grant.publication?.id
      );
      if (index === -1) {
        return;
      }

      setGrantCheckoutLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = true;
        return updatedArray;
      });
    }

    try {
      const encodedData = ethers.utils.defaultAbiCoder.encode(
        COLLECT_LEVEL_ABI as any,
        [chosenCurrency, item.chosenLevel.level, encryptedFulfillment]
      );

      await actOnGrant({
        actOn: {
          unknownOpenAction: {
            address: address,
            data: encodedData,
          },
        },
        for: item.grant.publication?.id,
      });
    } catch (err: any) {
      console.error(err.message);
    }

    if (item.chosenLevel.level == 1) {
      const index = allGrants.findIndex(
        (pub) => pub.publication?.id == item.grant.publication?.id
      );

      setSimpleCheckoutLoading((prev) => {
        const arr = [...prev];
        arr[index] = false;

        return arr;
      });
    } else {
      const index = cartItems.findIndex(
        (pub) => pub.grant.publication?.id == item.grant.publication?.id
      );
      if (index === -1) {
        return;
      }

      setGrantCheckoutLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    }
  };

  useEffect(() => {
    if (cartItems?.length > 0) {
      setGrantCheckoutLoading(
        Array.from({ length: cartItems.length }, () => false)
      );
    }
  }, [cartItems]);

  return {
    handleCheckout,
    grantCheckoutLoading,
    fulfillment,
    setFulfillment,
    handleEncryptFulfillment,
    encryptedFulfillment,
    fulfillmentLoading,
    chosenCurrency,
    setChosenCurrency,
    setChosenCartItem,
    chosenCartItem,
    simpleCheckoutLoading,
  };
};

export default useCheckout;
