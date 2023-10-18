import { useEffect, useState } from "react";
import actOnGrant from "../../../../graphql/mutations/actOn";
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
      const { ciphertext, dataToEncryptHash } = await LitJsSDK.encryptString(
        {
          accessControlConditions: [
            {
              contractAddress: "",
              standardContractType: "",
              chain: "mumbai",
              method: "",
              parameters: [":userAddress"],
              returnValueTest: {
                comparator: "=",
                value: FULFILLER_ADDRESS.toLowerCase(),
              },
            },
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

  const handleCheckout = async (item: CartItem) => {
    const index = cartItems.findIndex((pub) => pub.id === item.id);
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
        COLLECT_LEVEL_ABI,
        [chosenCurrency, item.level, encryptedFulfillment]
      );

      await actOnGrant({
        actOn: {
          unknownOpenAction: {
            address: address,
            data: encodedData,
          },
        },
        for: item.id,
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
