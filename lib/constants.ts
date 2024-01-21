import { ethers } from "ethers";

export const INFURA_GATEWAY: string = "https://chromadin.infura-ipfs.io";
export const BASE_URL: string = "https://api-v2-mumbai-live.lens.dev/";

export const LENS_HUB_PROXY: `0x${string}` =
  "0xC1E77eE73403B8a7478884915aA599932A677870";
export const GRANT_MILESTONE_CLAIM_CONTRACT: `0x${string}` =
  "0xa6931B10156721F55e6bd7D8A980254952A78BaA";
export const LEGEND_OPEN_ACTION_CONTRACT: `0x${string}` =
  "0x0eb82Cc9df6DB90fb05aD515B53eC9C5222A08F0";
export const DIGITALAX_PROFILE_ID_LENS: string = "0x012d";

export const COVER_CONSTANTS: string[] = [
  "QmaQ22NGDVsvNefVvS368oTYidLRf3GggnasER9biVGSD1",
  "QmRvfBagXndkaLhRgoNRH6LhBCkaNgeXX4AhJ3n9WFxsE6",
  "QmVrfq3BGabwxZwcSG5rxhypErdu5KcmEjtQjhh8v6SiXZ",
  "QmRoYZ1mSEgV68WtMT85a9N1RqserMasFgA8ufQp779Ntq",
  "QmXs2787jSmQiqgGiQykdHqKM8AK1DzbDFtPR1hvDEZ39a",
  "QmTDA1X27aPbjRupRANHvQ9Tuwi72oATvQQn77MDcm1qGs",
  "QmVF1praYSSGgY7BTapppwwGAHC2dne1mEhcTFWwHv8ohD",
  "QmVZrjtaxarZftV61kzLTjRxgtKCxVQxJiVWxbHNRMq5JU",
  "QmYJUA7553FdY79yUyNqv1Y4wUNBfaQpsHaWfYT9h22KBY",
  "QmYQxYaviBPur7abH593tF9zx3RUezpdEmr2hd2fbB4NvA",
  "QmPSRTqLkxHfWia7evEE7pEpJfWtLc2RWf8Zy4yoA6YNj3",
  "QmX69WNZ6XKuEHh594FnU8D7kNzyh6EzuTeigkERTcPJtL",
  "QmX8gnwuGMWE3XsC1g3oqbcUmp7GtmqbX7QLWqLUD6b4VM",
  "QmNPr2shf6KWQvUytnCVmuXhEb57DCCFqm1dh29u32vMCP",
  "QmUcyNAwvd3LhmCsDB3K14Qtf1keMnQBftQ1MLDUNdZFCk",
  "QmWcFnhJ3tq9XLtqM18DQep1egVu4djr4a3WETDa3hzoi3",
  "Qmbcr5BMbFCkggGxRc6ANRCk7F1FGuC4Wxxvncg4Dy3tmp",
  "QmWjBqsDTQ9CYRXK4GA19t3aD8dFzsbJK5wuGWX59bUdss",
  "QmcBA95Ksi2CPEuKnwyH9sTkGGxbiieMgam3hDHzRxxLRG",
  "QmVTqar5ME5UUxE1wCxud9yz7nAtnMMwBUtVRBNkGqyq1g",
  "QmewZLieFb4ysnKoSz31JaAiE5dRgNEUTdgbnCTTUDYUyM",
  "QmTVHJWNa6fYgKM1kXETcT2oDwC98rAC3moAfPFgtVs1u7",
  "QmUroWN1RqVVmJsUGRq5oo6iNokJyqs7uQ5PfjLZhvLQYG",
  "QmUX3nYrxnJkdkLEaQHjNwcUWEVH1fLfetnRFZ6rLA1xyS",
  "QmUFitMXrhTrrmsFHbfHJwBQHoGPPN6N3aEFFSdMSaiuWg",
  "QmRfrciwnW21tcFCyiZG8agirkDAWRFFNgM4oKg7EtUxyK",
  "QmXc5sqgJ8qN79YQLxU7TvsesKhM1VeX3pZWd4g9CbmL9u",
  "QmYJ7Kw2eJ9fEw98zAkjNAks2XwDqT9MYdJkwR1ibGWyhf",
  "Qmcp47m2rKv78tC34QFdfTJLgzCSVn88dmjwGxGfFi4GM6",
  "QmfR4mcVHBV7qP5dWtYCgr3Wk95usVAQH5h3FqnF2nAMaZ",
  "QmZ1rr7j8U82AmrngfN2zejs7pmet5nCTxeXVgHgA9AKzf",
  "QmendgrbZZ8giKaydaQ7zwYtjkudNJ56PoeiVCKkgtdJ3v",
  "Qmc23CZJekC5oR3xR9HzGVz35zg1J9gWws5ncXt99gWE3U",
  "QmQE47mLE4M8R2RujYAUsKHxd9aTae2BktzFjgJV7s8baa",
  "QmXrZRWJdvqpJWzDJzzZAK3kRo7zsgwGAWhq7B1dYYSLk4",
  "QmPqQzNJ9gpYdC7o6fHi3WK1h8PP6SiMMYQooFeMEf1ijF",
  "QmdceejoVF8dd7eu9kxBgmqrw7RmSx1qCfVb2LbZhMCXTn",
  "QmQ61zvy2voytrGcedGS6a2AVtbXjPchigfBycLkzADeSA",
  "QmZTaMUwVziHPmmAsTuWpmVTtkh14aPBhSEteS9SVpDMsv",
  "QmQJqn9q1SjToMSfpsfXXbq899tCNVBb2F3bhogf4sb392",
  "Qmb4cTMcuzSRsRLBo8iyKRX7Eirdnc9caGSGk2UTWyKGAE",
  "QmdZtDheGXh4V2b5s1H8gzrvc5tn3NbzKEVvDcHHNsPy2F",
  "Qmb1cD4YYPdVR9cPB6LAPu2h5kvbGfPWLW6y4ckUWK1s8y",
  "QmbVfgr5UpfSYALUS3gcKcp7a81HHaGwwLnFN4pm6aMFfc",
  "QmS15TKmiJgzvb9sZwrRQaQtRxY2kGWn7kq4KPPFPK5jtv",
  "QmVAMjxU1mCdSM12CqZymAdGF5yM9vENz5S47gvJB2EAir",
  "QmVcUkJPPR1mgtCki5Ebt9pAdVm5A5qfTnWfHtQzAUJUCf",
  "QmcZYQZweD3DscGgSrm5giTZmPhMvHWMQLZSmNLwBneRPt",
  "QmW9714FptPKF13LEzpAbDNzksEcny2pmeZ6oVcn534wRa",
  "QmPPmoHtDuYSjWnNauaJ92tZGPsEWEQmp3PwUn4nVE4miB",
  "QmVGbYVoexWXZUVWrT198f9NieCpYAzmTumvsELFMogZC8",
  "QmWHFnLsaReM3DFpbhYZ9dNf31XsCRswWg3dcyBf7Rgh6c",
  "QmbFjF4WxHzJ6wKd9fN5ak9wjJtT9ziiz9gdcaWQFz3DQh",
  "Qmc3Ce4xxfnK68qCY642gtkzsMMGpMxLv8vL7SWvu55sBE",
  "QmUvdUxNV8HXqLUKRV81Z2S9nJ4bnakmKkP2TXQvFSui7j",
  "QmcJmNL7Npe6evBCFn3eC7AA5fYDqoef8kvXXWrGxvVzyD",
  "QmcFhgudmJY2ge86skpEpZcmRVqQZMX3tmnHMZrimE2Pdm",
  "Qma6vLVePXDvj63Ky3c7CNWY9jqPpKsLXN6AzdXDYPakry",
  "QmZ5t6gkL6kxECaPd8YmVWdopmRXeGKfi69s7UG4dMdqUq",
  "QmfVp9ZfuRHBzRSDkrbidGoYb3Zddtk8d7P87jfQVFghbC",
  "QmcTbYDiKbjRyFPx6o7JvaN7MFWwCP8SfY95airJ4y4TBs",
  "QmPvkmfcMcFZPnnyF8FZig5LSDSRyFZVB6Mk6h5gN2xABd",
  "QmPeMq7Li2LuW4RaKdSUx3TDuR5qv8R8AgzSZrtry5wCKm",
  "QmQUJdhuHYSqHvVaWSbfr3gRUi2JCutSC9Cin93bhzEb77",
  "Qmbshxz3dHzGyW1451dMqHiD8s1DMGhdmeqEEwCyDzRtNa",
  "QmRUKcUEeyfwC76XoqCKgdWKBs4N9B3xZZALpht7szFDJ2",
  "QmVh1xFMjy66DbbECTq5nNrB9NvP5FmV7cJNLNyqpPKgsH",
  "QmPJw9TfL3icWStDYMyjftYAiEQCkkmT1zbQekUFMq49BC",
  "QmVzoWsN1aTvTUkwTutEBEFXZ7vx7NJX3G681wrhuWeVjD",
  "QmQGFQFy4LnoUy3y1sdqcsWU262pt4RY1kXNjyN8oy9BPC",
  "QmWTYF7EgmUG5vapXbwS21CBBDwx4YfUfARVm8ztsGtX4A",
  "QmX342oNNgwYAQ3Dfc9dE8xsFNPrds39zboWPjC5ztFgoe",
  "QmYhL6SDnVw3bgDiuM99ewn1QWwNSzBpW8Y2WKJ553cjif",
  "QmcKey99NE37wae2TsmxQPQzReTwTC3ie7oBdwPxanDhvR",
  "QmdLK2u39GprJeBjW86mdifst9GQY6SNucdJGHZs6iCf7o",
  "QmTaKMoeaoc4qe4m3NixPKZn9BnjY3rT5e314vy7MJA8h7",
  "QmU32DLLfKFyRzXRmmDVQAZ47yiVuu4ydLL3CiSB3YAi1W",
  "QmStgQvjvHHmfHgJExdpCeZaw2kgk1zCwVwvtZNBep88BV",
  "QmdTbDx4tvRzhjV3FmLEekRwT3L3Q6cZm3yJWQhCq3B1wZ",
  "QmVWoXzBK2QBLGPZhQcFTmB2HsqPKERysfnNfyPgm7RAud",
  "QmVsQbuSiCh6YfvkMEdjQyjuuRZgkRySQMzsW1XSPSSyZo",
  "QmVgZbDqsboMRrquWSDDoM6YSPtmyU5JSPTEo8N9RSfQeb",
  "Qmb15HfS73H43T1MsCkfPdzNPyi1p3rqgcF7yjGocFmkg7",
  "QmdJ7EuyenjWvn6LPKNsTZ26SsfBA4CZFepAM1vexHmfED",
  "QmPjR9krw1LEHPzUa5siPxEG68b7tYd1rEEj29bk557Qex",
  "QmcfYagTknjmZX2hn6EPyWPymFJjBHqYSdumoWgpMqkqaU",
  "QmZB4pCAqBu8AoHJoSzkQHm9hgnaPu7PC8tq5d3GwJwrEb",
  "QmYNL4iuZHZUptn5BWQwt7yf4vnPb7jedYxiqC2tWbmRsV",
  "QmQB6G7G4VC4Jyy3VMmTNsjprW9TY4uCwiexw8EeY1GP3U",
  "Qme2urNvDM8pzEriUCUHXiRsn1QM63jDxuSAnWAriebd5c",
  "QmeEDR7KAEivG7YdBiis26ohJrX81EBUFEwh1h7EktRYEP",
  "QmYFTPYCFDvWLb2brAJdKYgJznge5ast1ewcnRLyRfD9JH",
  "QmTYZ376ieWbAZMU9ndM31YRGcg8xe54BtCTVwEGopAAy3",
  "QmddEFUVrbE9fhc7HiC12TQ5qyzqc82gjbyCjNEJEWzxGi",
  "QmW4aiexwDUikQNLDewtMFqPGnKQVm9ZDFeVkqagSPhrHx",
  "Qme75EkW6W6ctbJoWr98aMjdTXVUqTL2Gm9FvhaDX7qMLR",
  "Qmf7ieuGGTavDqSGTzk89XLxndsZcRkDnhje9jLqVjQ4f6",
  "QmW53j2WVGgbJ1dBLjJt6q3RCCQgTLcH6LKpBeph2dyg59",
  "QmYfCpire6FpsDJbNWVbeDSWGohVuyAxWQEu1pQ1zmZrXg",
  "QmaqmMW9pnVJ8rhn7q4ghd8ZZSBaqS5XvpiLo3kxSjCKei",
  "QmPKVbt3yNNTo41a7jKZAWo1jdeTpUrbdD3uXMUzj7LihS",
  "QmVkMrfTKDVxNZRRF1CEycDc5nungmcrDMWPB8TXq4kmXk",
  "QmPcfY7kpA6pDyABDRqpmZbGWPyLX9YrKQdJsWJmGh9SAe",
  "QmNtjaBD8XftQXEUTMF83C748fd6M1xEtTZuoYVAMb58fr",
  "QmQV2Yvbx1cHj2F4tAh4yDfuprTdZ3eZjWHhfcrCUyFQLf",
  "QmPDY6x6uCdTC2TucNmufjDCq18QcJTQq1Hva2yjEkCuW8",
  "QmUrV7Rs5oZoThg9fBs2ND8c3RuMqEtRrP5pEqk9uw367f",
  "QmXxuhAvWqVEoZ9i3CgjNGbmLvcbjJvamaxv1VGUQUpMur",
  "QmV6bMvL2opL1mrcgzLLPCZK4FDs3EVboyqykRjsZVyAwE",
  "Qmcp7LbMVa8bv2A7U9crTCe3Q9tZoH72jPg7aE6k3Va3BK",
  "QmbkXGrXdL56nwFcNiVr981WyyThyfm4xwN2RMeaPQnnMA",
  "QmXz48ykUhNA2TGE7zBZ9edLAqvcbkLT9BtmgBYPEBBs4C",
  "QmXUYvTtUL23Rfp1Sv776782Cs4WKDtJ3KBp817d76YUvd",
  "QmW8NGAm4vnUadjHiE2sNoP39k1aVBFAJtaQ87ZFVb7MTy",
  "QmetTfmDQmiHQWasrxvnLVFaGNeSPpbmDFYJCKkZ5rFGLw",
  "QmZ8U4oa4oZ3i2gLM7Cy1g9Mym98m4k4xmNco7v7BweReM",
  "QmZn1Gmcu94B7hWLcx8FdiECvCqY1wgzwwXZSzZivdtGyA",
  "QmbHTAuk98KXDzYfqJkJrj7QcHFkpEb7a3HChGNeRNNkHk",
  "QmdXwyP8q3ko4EP8vtUb85iNJcjCcdRDW7kz5pryJMh8Lf",
  "QmZGPmRRf1xuNzrk8Exy4F4mJ8tJ1CCD2LsC4JPUmkMqfi",
  "QmZELDiyM6G8ShqAvjH354HfdQH8MxgRQJDPZDNMaGAM6t",
  "QmUnoyfSJXNGnwuJhSqR55ZH8nmwHxceyU7sfWYjFkbBMW",
  "QmNnRDAxWkqSxsQjJxK2tnT6X5pj68TYfexLNcXHEqko7k",
  "QmVezEufqjUjV8EbXXFyooSuQLpjkAZcoEomScTEmKyw3L",
  "QmQKczGmPPTpNcsBjfWkDCmuhR235KLzBpp2TWcKYn9WYG",
  "QmRLnPiwpGnEr6t2Ch1Cqi5jkezE3759saUjnPJcpTmatQ",
  "QmQ6e9HM2tgnjfMt4fUVjiaxc3BuGRXHViH7D9jaZkBbW1",
  "QmVHsbFJ8aKty67KgpBcqrewXQE4rS4eVgSjnDJSNBmwBf",
  "QmSBcvaA2CBhsYrKsE5ZPTcEExo1yHnfRMfpxmMp8RDzUy",
  "QmTDxh85YPoqvFY9LPXXXgw6g93gXWUYyZd5XeFopA4TVB",
  "QmYqiJCyjaEMhkXG3HLVfdq1NcnmzGYEYyJpso9r3MhExF",
  "Qme6WErXYCnf3ri1AVMYJyrYqoneHGCU14HggV6DNE2oRc",
  "Qmea6JXuHvwirTNTCGKbnTj4NeumAwgHmpTmaxe4RzZm3m",
  "QmVRzqpL8rvTyr14H5Vf7pd5fvdKynd11mRayJbmx4BijW",
  "QmcwCScgG46dJXcB5VKuunWMnG8KK5Y52sUa2L5XzB6hnM",
  "QmTPeo6i7rKbbvKcXvzrq8ZGFeS3ZJkxpZoP8YkTLLbwoN",
  "QmbvnWjext91R4FJ3oBmdXn6A19k575DeoGkT4Lb3Zxoze",
  "QmaahzigyD83bv3LjtqvhkuL19YSobBvD14dwfu7JSTdin",
  "QmYdpVGkc6DK7qu2LKakwSvA38qWu6FWHXybi5DRSLSMfX",
  "QmWvgmf3wg6bj77W7sqwgwFkYJ82NRrJdr6kAiPVgSSxcA",
  "QmU1d4N9p83BDGdewvT4ncCSeSLfiZcmVWcU5ygxz5c5a4",
  "QmYzv28sbCpFX1yrxvxPJFvSjFx6czuPDfvL6Rta5fArJc",
  "QmUueQ2LMtwCyYoA6CmJumJdV7c66LUkWDoUMyUTxtohtd",
  "Qmf4ptJEHbbVBxKvvTJ37UpRuL7M5ig2AzykPvStsdFFJ3",
  "QmWj8kKJoBQUf7Hi3ZsFxeJisfNNdgtWjTxcuNySYfVjZB",
  "QmYL3FDBfUTizTpj3kszFvMtZnXWhR53sxkDa9AEpPN6Kr",
  "QmPcxeqPgjJmCktfsTFfLsQCvwZeDbcgPJEZMi6Sm8X7J8",
];

export const LEVEL_INFO_ABI: ethers.utils.ParamType[] = [
  {
    name: "collectionIds",
    type: "uint256[][6]",
    baseType: "tuple",
    indexed: false,
    components: [
      {
        name: "collectionIds",
        type: "uint256[]",
        baseType: "uint256",
        indexed: false,
      } as ethers.utils.ParamType,
      {
        name: "amounts",
        type: "uint256[]",
        baseType: "uint256",
        indexed: false,
      } as ethers.utils.ParamType,
    ],
  } as ethers.utils.ParamType,
];

export const COLLECT_LEVEL_ABI: [
  {
    type: string;
    components: {
      name: string;
      type: string;
      baseType: string;
      indexed: boolean;
    }[];
  }
] = [
  {
    type: "tuple[]",
    components: [
      {
        name: "currency",
        type: "address",
        baseType: "address",
        indexed: false,
      },
      {
        name: "level",
        type: "uint256",
        baseType: "uint256",
        indexed: false,
      },
      {
        name: "encryptedFulfillment",
        type: "string",
        baseType: "string",
        indexed: false,
      },
    ],
  },
];

export const APPAREL_SIZE: string[] = ["xs", "s", "m", "l", "xl"];
export const STICKER_SIZE: string[] = ['11"x17"', '18"x24"', '24"x36"'];
export const POSTER_SIZE: string[] = ['2"x2"', '4"x4"', '6"x6"'];

export const ACCEPTED_TOKENS: string[][] = [
  [
    "QmYYUQ8nGDnyuk8jQSung1WmTksvLEQBXjnCctdRrKtsNk",
    "WMATIC",
    "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  ],
  [
    "QmZRhUgjK6bJM8fC7uV145yf66q2e7vGeT7CLosw1SdMdN",
    "WETH",
    "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
  ],
  [
    "QmSbpsDRwxSCPBWPkwWvcb49jViSxzmNHjYy3AcGF3qM2x",
    "USDT",
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  ],
  [
    "QmS6f8vrNZok9j4pJttUuWpNrjsf4vP9RD5mRL36z6UdaL",
    "MONA",
    "0x6968105460f67c3bf751be7c15f92f5286fd0ce5",
  ],
];

export const ACCEPTED_TOKENS_MUMBAI: string[][] = [
  [
    "QmYYUQ8nGDnyuk8jQSung1WmTksvLEQBXjnCctdRrKtsNk",
    "WMATIC",
    "0x3cf7283c025d82390e86d2feb96eda32a393036b",
  ],
  [
    "QmZRhUgjK6bJM8fC7uV145yf66q2e7vGeT7CLosw1SdMdN",
    "WETH",
    "0x566d63f1cc7f45bfc9b2bdc785ffcc6f858f0997",
  ],
  [
    "QmS6f8vrNZok9j4pJttUuWpNrjsf4vP9RD5mRL36z6UdaL",
    "MONA",
    "0xf87b6343c172720ac9cc7d1c9465d63454a8ef30",
  ],
  [
    "QmSbpsDRwxSCPBWPkwWvcb49jViSxzmNHjYy3AcGF3qM2x",
    "USDT",
    "0x07b722856369f6b923e1f276abca58dd3d15243d",
  ],
];
