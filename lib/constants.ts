export const INFURA_GATEWAY: string = "https://chromadin.infura-ipfs.io";

export const BASE_URL: string = "https://api-v2-mumbai.lens.dev/";

export const GRANT_REGISTER_CONTRACT: `0x${string}` =
  "0xDCA5f61037d77188439D519117261ACbC14c3D7D";
export const GRANT_MILESTONE_CLAIM_CONTRACT: `0x${string}` =
  "0xa6931B10156721F55e6bd7D8A980254952A78BaA";
export const OPEN_ACION: `0x${string}` =
  "0x86179F3Df6713011FB9220bc57940a12f67731EA";

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

export const LEVEL_INFO_ABI: [
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
        name: "collectionIds",
        type: "uint256[]",
        baseType: "uint256[]",
        indexed: false,
      },
      {
        name: "amounts",
        type: "uint256[]",
        baseType: "uint256[]",
        indexed: false,
      },
      {
        name: "indexes",
        type: "uint256[]",
        baseType: "uint256[]",
        indexed: false,
      },
      {
        name: "totalPrice",
        type: "uint256",
        baseType: "uint256",
        indexed: false,
      },
    ],
  },
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

export const APPAREL_SIZE: string[] = ["xs", "s", "m", "lg", "xl"];
export const STICKER_SIZE: string[] = ['11"x17"', '18"x24"', '24"x36"'];
export const POSTER_SIZE: string[] = ['2"x2"', '4"x4"', '6"x6"'];
