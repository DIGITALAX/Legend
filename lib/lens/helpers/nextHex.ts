const nextHex = (hex: string): string => {
  const decimal = parseInt(hex, 16) + 1;
  let nextHex = decimal.toString(16);

  while (nextHex.length < hex.length) {
    nextHex = "0" + nextHex;
  }

  return "0x" + nextHex;
};

export default nextHex;
