import { useEffect, useState } from "react";
import actOnGrant from "../../../../graphql/lens/mutations/actOn";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { CartItem, Fulfillment } from "../types/checkout.types";
import { COLLECT_LEVEL_ABI } from "../../../../lib/constants";
import * as LitJsSDK from "@lit-protocol/lit-node-client";

const useCheckout = () => {
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const litNodeClient = new LitNodeClient({
    litNetwork: "cayenne",
  });
  const { address } = useAccount();
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
  const [encryptedFulfillment, setEncryptedFulfillment] = useState<string>();
  const [itemCheckedOut, setItemCheckedOut] = useState<boolean[]>([]);

  const handleEncryptFulfillment = async () => {
    setFulfillmentLoading(true);
    try {
      const authSig = await LitJsSDK.checkAndSignAuthMessage({
        chain: "mumbai",
      });
      const fulfillers = handleFulfillers();
      const { ciphertext, dataToEncryptHash } = await LitJsSDK.encryptString(
        {
          accessControlConditions: [
            ...(fulfillers as any),
            {
              contractAddress: "",
              standardContractType: "",
              chain: "mumbai",
              method: "",
              parameters: [":userAddress"],
              returnValueTest: {
                comparator: "=",
                value: address?.toLowerCase()!,
              },
            },
          ],
          authSig: authSig,
          chain: "mumbai",
          dataToEncrypt: JSON.stringify(fulfillment),
        },
        litNodeClient
      );
      setEncryptedFulfillment(
        JSON.stringify({
          ciphertext: ciphertext,
          dataToEncryptHash: dataToEncryptHash,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setFulfillmentLoading(false);
  };

  const handleFulfillers = (): (
    | {
        contractAddress: string;
        standardContractType: string;
        chain: string;
        method: string;
        parameters: string[];
        returnValueTest: {
          comparator: string;
          value: string;
        };
      }
    | {
        operator: string;
      }
  )[] => {
    const addresses = cartItems.reduce<string[]>((acc, item) => {
      acc.push(item.fulfiller);
      return acc;
    }, []);

    let fulfillers = [];

    for (let i = 0; i < addresses.length; i++) {
      fulfillers.push({
        contractAddress: "",
        standardContractType: "",
        chain: "mumbai",
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: addresses[i].toLowerCase(),
        },
      });
      fulfillers.push({
        operator: "or",
      });
    }

    return fulfillers;
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

  const handleConnectLit = async () => {
    try {
      await litNodeClient.connect();
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (cartItems?.length > 0) {
      setGrantCheckoutLoading(
        Array.from({ length: cartItems.length }, () => false)
      );
      setItemCheckedOut(Array.from({ length: cartItems.length }, () => false));
    }
  }, [cartItems]);

  useEffect(() => {
    handleConnectLit();
  }, []);

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
