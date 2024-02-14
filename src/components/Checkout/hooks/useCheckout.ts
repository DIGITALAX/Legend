import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CartItem, Fulfillment } from "../types/checkout.types";
import * as LitJsSDK from "@lit-protocol/lit-node-client";
import { AccessControlConditions } from "@lit-protocol/types";
import {
  Details,
  OracleData,
  PrintItem,
} from "@/components/Launch/types/launch.types";
import { Grant } from "@/components/Grants/types/grant.types";
import { Dispatch } from "redux";
import lensCollect from "../../../../lib/lens/helpers/lensCollect";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygonMumbai } from "viem/chains";
import { LEGEND_OPEN_ACTION_CONTRACT } from "../../../../lib/constants";
import { Profile } from "../../../../graphql/generated";
import { NextRouter } from "next/router";

const useCheckout = (
  cartItems: CartItem[],
  litNodeClient: LitJsSDK.LitNodeClient,
  address: `0x${string}` | undefined,
  allGrants: Grant[],
  dispatch: Dispatch,
  publicClient: PublicClient,
  lensConnected: Profile | undefined,
  oracleData: OracleData[],
  details: Details[][],
  router: NextRouter,

) => {
  const [grantCheckoutLoading, setGrantCheckoutLoading] = useState<boolean[]>(
    []
  );
  const [spendApproved, setSpendApproved] = useState<boolean[]>([]);
  const [simpleCheckoutLoading, setSimpleCheckoutLoading] = useState<boolean[]>(
    []
  );
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

  const approvePurchase = async (item: CartItem, currency: string) => {
    if (!address || !lensConnected?.id) return;
    let index = -1;
    try {
      if (item.chosenLevel.level == 1) {
        index = allGrants.findIndex(
          (pub) => pub.publication?.id == item?.grant?.publication?.id
        );

        if (index === -1) {
          return;
        }

        setSimpleCheckoutLoading((prev) => {
          const arr = [...prev];
          arr[index] = true;

          return arr;
        });
      } else {
        index = cartItems.findIndex(
          (pub) => pub.grant.publication?.id == item?.grant?.publication?.id
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

      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: currency as `0x${string}`,
        abi: [
          currency === "0x6968105460f67c3bf751be7c15f92f5286fd0ce5"
            ? {
                inputs: [
                  {
                    internalType: "address",
                    name: "spender",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "tokens",
                    type: "uint256",
                  },
                ],
                name: "approve",
                outputs: [
                  { internalType: "bool", name: "success", type: "bool" },
                ],
                stateMutability: "nonpayable",
                type: "function",
              }
            : currency === "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
            ? {
                constant: false,
                inputs: [
                  { name: "guy", type: "address" },
                  { name: "wad", type: "uint256" },
                ],
                name: "approve",
                outputs: [{ name: "", type: "bool" }],
                payable: false,
                stateMutability: "nonpayable",
                type: "function",
              }
            : {
                inputs: [
                  {
                    internalType: "address",
                    name: "spender",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                  },
                ],
                name: "approve",
                outputs: [
                  {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                  },
                ],
                stateMutability: "nonpayable",
                type: "function",
              },
        ],
        functionName: "approve",
        chain: polygonMumbai,
        args: [
          LEGEND_OPEN_ACTION_CONTRACT,
          BigInt(
            Math.ceil(
              ((item.chosenLevel.level == 1
                ? 10 ** 18
                : Number(
                    item.chosenLevel.collectionIds?.map(
                      (coll, index) => coll.prices[item.sizes[index]]
                    )
                  )) /
                Number(
                  oracleData?.find((oracle) => oracle.currency === currency)
                    ?.rate
                )) *
                Number(
                  oracleData?.find((oracle) => oracle.currency === currency)
                    ?.wei
                )
            )
          ),
        ],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      setSpendApproved((prev) => {
        const arr = [...prev];

        arr[index] = true;
        return arr;
      });
    } catch (err: any) {
      console.error(err.message);
    }

    if (item.chosenLevel.level == 1) {
      const index = allGrants.findIndex(
        (pub) => pub.publication?.id == item?.grant?.publication?.id
      );

      if (index === -1) {
        return;
      }

      setSimpleCheckoutLoading((prev) => {
        const arr = [...prev];
        arr[index] = false;

        return arr;
      });
    } else {
      const index = cartItems.findIndex(
        (pub) => pub.grant.publication?.id == item?.grant?.publication?.id
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

  const encryptFulfillment = async (colors: string[], sizes: string[]) => {
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
          dataToEncrypt: JSON.stringify({
            fulfillment,
            colors,
            sizes,
          }),
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
      return "ipfs://" + responseJSON?.cid;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleCheckout = async (item: CartItem, currency: string) => {
    if (!address || !lensConnected?.id) return;

    if (
      Object.entries(fulfillment).find((item) => item[0] == "") &&
      item.chosenLevel.level !== 1
    ) {
      return;
    }
    if (item.chosenLevel.level == 1) {
      const index = allGrants.findIndex(
        (pub) => pub.publication?.id == item?.grant?.publication?.id
      );

      if (index === -1) {
        return;
      }

      setSimpleCheckoutLoading((prev) => {
        const arr = [...prev];
        arr[index] = true;

        return arr;
      });
    } else {
      const index = cartItems.findIndex(
        (pub) => pub.grant.publication?.id == item?.grant?.publication?.id
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
        ["uint256[]", "string", "address", "uint8"],
        [
          item.chosenLevel.level == 1 ? [] : item.sizes,
          item.chosenLevel.level == 1
            ? ""
            : await encryptFulfillment(
                item.chosenLevel.collectionIds.map(
                  (coll, index) =>
                    coll.collectionMetadata.colors[item.colors[index]]
                ),
                item.chosenLevel.collectionIds.map(
                  (coll, index) =>
                    coll.collectionMetadata.sizes[item.sizes[index]]
                )
              ),
          currency,
          item.chosenLevel.level,
        ]
      );

      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await lensCollect(
        item.grant.publication?.id,
        "",
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient,
        {
          unknownOpenAction: {
            address: LEGEND_OPEN_ACTION_CONTRACT,
            data: encodedData,
          },
        }
      );

      // dispatch(setGrantCollected(item.grant));
      // update the totalFundedUSD so the bar updates!
    } catch (err: any) {
      console.error(err.message);
    }

    if (item.chosenLevel.level == 1) {
      const index = allGrants.findIndex(
        (pub) => pub.publication?.id == item?.grant?.publication?.id
      );

      setSimpleCheckoutLoading((prev) => {
        const arr = [...prev];
        arr[index] = false;

        return arr;
      });
    } else {
      const index = cartItems.findIndex(
        (pub) => pub.grant.publication?.id == item?.grant?.publication?.id
      );

      setGrantCheckoutLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    }
  };

  const checkSpendApproved = async () => {
    try {
      if (address) {
        let spends: boolean[] = [];
        await Promise.all(
          allGrants.map(async (_, index) => {
            const data = await publicClient.readContract({
              address: details[index][0].currency as `0x${string}`,
              abi: [
                {
                  inputs: [
                    {
                      internalType: "address",
                      name: "owner",
                      type: "address",
                    },
                    {
                      internalType: "address",
                      name: "spender",
                      type: "address",
                    },
                  ],
                  name: "allowance",
                  outputs: [
                    {
                      internalType: "uint256",
                      name: "",
                      type: "uint256",
                    },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
              ],
              functionName: "allowance",
              args: [address as `0x${string}`, LEGEND_OPEN_ACTION_CONTRACT],
              account: address,
            });

            if (
              Number((data as any)?.toString()) *
                Number(
                  oracleData?.find(
                    (oracle) => oracle.currency === details[index][0].currency
                  )?.wei
                ) >=
              Number(10 ** 18) /
                Number(
                  oracleData?.find(
                    (oracle) => oracle.currency === details[index][0].currency
                  )?.rate
                )
            ) {
              spends.push(true);
            } else {
              spends.push(false);
            }
          })
        );
        setSpendApproved(spends);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (cartItems?.length > 0) {
      setGrantCheckoutLoading(
        Array.from({ length: cartItems.length }, () => false)
      );
    }
  }, [cartItems]);

  useEffect(() => {
    if (
      allGrants.length > 0 &&
      router.asPath.includes("/") &&
      details.length > 0 &&
      address
    ) {
      checkSpendApproved();
    }
  }, [allGrants.length, details, address]);

  return {
    handleCheckout,
    grantCheckoutLoading,
    fulfillment,
    setFulfillment,
    setChosenCartItem,
    chosenCartItem,
    simpleCheckoutLoading,
    spendApproved,
    approvePurchase,
  };
};

export default useCheckout;
