import { ethers } from "ethers";

export const INFURA_GATEWAY: string = "https://chromadin.infura-ipfs.io";
export const BASE_URL: string = "https://api-v2-mumbai.lens.dev/";

export const LENS_HUB_PROXY: `0x${string}` =
  "0xC1E77eE73403B8a7478884915aA599932A677870";
export const GRANT_REGISTER_CONTRACT: `0x${string}` =
  "0xDCA5f61037d77188439D519117261ACbC14c3D7D";
export const GRANT_MILESTONE_CLAIM_CONTRACT: `0x${string}` =
  "0xa6931B10156721F55e6bd7D8A980254952A78BaA";
export const OPEN_ACTION_CONTRACT: `0x${string}` =
  "0x0eb82Cc9df6DB90fb05aD515B53eC9C5222A08F0";
export const SPLITS_CONTRACT: `0x${string}` =
  "0x6603eE13D851Fa4A74A99854dc17cD7192e0A21E";
export const DIGITALAX_PROFILE_ID_LENS: string = "0x012d";

export const MILESTONE_COVERS: string[] = [
  "QmTC4QyfKBZjGxmbB4SUY6vMRiyLcJWnSBzsoiHywspg5E",
  "QmfSQY8vH81PgMA3LcHD6eU6HKoUPj12KjT2evFkEMYAkv",
  "QmfYMBT2P998h5mr9JePGHhFXxgm6TBJKgoYUd8JNAzbUx",
  "QmTou2K3N9WZ16SLVq4e8iD7nbSXiTm6qaozX2D9XaXCAu",
  "QmYQxYaviBPur7abH593tF9zx3RUezpdEmr2hd2fbB4NvA",
  "QmZtbRMbiQk6RjFzgLM7LYtxjF2XNhR8saxo3utJQVbuXK",
  "QmSXrqaY2oerXUYqHXuiAkF4RKgX7GJftLKqatUhwy5QSr",
  "QmdJ7EuyenjWvn6LPKNsTZ26SsfBA4CZFepAM1vexHmfED",
  "QmUBJmJLp1ukwKRpxvKcCuSdRYNrAGqpQhpycGQDkRyjiw",
  "QmVRzqpL8rvTyr14H5Vf7pd5fvdKynd11mRayJbmx4BijW",
  "QmNxit6Ut6opyPpZeugTFhCbtrf5tLFmJToBRBKUEJfmPL",
  "QmS8Cf5fMQ7rZ5cdrtBmJST5ejTkDZtfKYuqSyEB2QQhRU",
];

export const LEVEL_INFO_ABI: ethers.utils.ParamType[] = [
  {
    name: 'collectionIds',
    type: 'uint256[][6]',
    baseType: 'tuple',
    indexed: false,
    components: [
      {
        name: 'collectionIds',
        type: 'uint256[]',
        baseType: 'uint256',
        indexed: false,
      } as ethers.utils.ParamType,
      {
        name: 'amounts',
        type: 'uint256[]',
        baseType: 'uint256',
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
