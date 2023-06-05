import { INFURA_GATEWAY } from "@/lib/constants";
import Head from "next/head";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";

const Custom404: FunctionComponent = (): JSX.Element => {
  const router = useRouter();
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-x-hidden">
      <Head>
        <title>Page Not Found</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
        <div className="relative w-full h-fit flex items-center justify-center font-earl text-black text-base sm:text-lg text-center row-start-1">
          Frequency out of range. <br />
          <br /> Find Your Way Back Home.
        </div>
      </div>
    </div>
  );
};

export default Custom404;
