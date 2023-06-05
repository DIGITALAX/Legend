import { useEffect, useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import UpkeepAbi from "./../../../abi/Upkeep.json";
import LinkAbi from "./../../../abi/LinkToken.json";
import {
  MATIC_LINK_TOKEN,
  MUMBAI_LINK_TOKEN,
  MUMBAI_UPKEEP,
} from "@/lib/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { waitForTransaction } from "@wagmi/core";
import { useBalance } from "wagmi";

const useKeeper = () => {
  const legendKeeperAddress = useSelector(
    (state: RootState) => state.app.contractValuesReducer.value[0]
  );
  const postValues = useSelector(
    (state: RootState) => state.app.postValuesReducer.value
  );
  const { address } = useAccount();
  const [balanceAmount, setBalanceAmount] = useState<number>();
  const [text, setText] = useState<string>("send link");
  const [keeperRegisterLoading, setKeeperRegisterLoading] =
    useState<boolean>(false);
  const balance = useBalance({
    address: address,
    token: MUMBAI_LINK_TOKEN,
  });

  const { config, error, isSuccess } = usePrepareContractWrite({
    address: "0xb927AEf40a884656e95D03acD4087b100De76eca",
    abi: UpkeepAbi,
    args: [
      "test",
      "0x",
      "0xf740550ca94b1cbdbbc25949c42511b5ed94caaf",
      500000,
      address,
      "0x",
      "2000000000000000000",
      "0xb927AEf40a884656e95D03acD4087b100De76eca",
    ],
    functionName: "registerAndPredictID",
    // enabled: Boolean(legendKeeperAddress),
  });

  const { writeAsync } = useContractWrite(config);

  const { config: sendConfig } = usePrepareContractWrite({
    address: MUMBAI_LINK_TOKEN,
    abi: LinkAbi,
    args: [
      "0xb927AEf40a884656e95D03acD4087b100De76eca",
      Number("2000000000000000000"),
    ],
    functionName: "transfer",
    // enabled: Boolean(legendKeeperAddress),
  });

  const { writeAsync: sendWriteAsync } = useContractWrite(sendConfig);

  // console.log({ error, isSuccess });

  const registerUpkeep = async () => {
    setKeeperRegisterLoading(true);
    try {
      const tx = await writeAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      setText("view register");
    } catch (err: any) {
      console.error(err.message);
    }
    setKeeperRegisterLoading(false);
  };

  const sendLink = async () => {
    if (
      !balance.data?.value ||
      parseInt(balance.data?.value.toString()) < Number("2000000000000000000")
    ) {
      return;
    }
    setKeeperRegisterLoading(true);
    try {
      const tx = await sendWriteAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      setText("register keeper");
    } catch (err: any) {
      console.error(err.message);
    }
    setKeeperRegisterLoading(false);
  };

  useEffect(() => {
    if (!balanceAmount && balance.data?.value) {
      setBalanceAmount(parseInt(balance.data?.value.toString()));
    }
  }, [balance.data?.value]);

  return {
    keeperRegisterLoading,
    registerUpkeep,
    sendLink,
    balanceAmount,
    text,
  };
};

export default useKeeper;
