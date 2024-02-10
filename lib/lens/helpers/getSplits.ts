const getSplits = (
  price: number,
  fPercent: number,
  fBase: number,
  dPercent: number
): {
  fulfiller: number;
  designer: number;
  grantee: number;
} => {
  const total = price / 10 ** 18;
  const fulfillerShare = fPercent * (total - fBase) + fBase;
  const designerShare = dPercent * (total - fBase);
  const granteeShare = total - designerShare - fulfillerShare;

  return {
    fulfiller: Number(((fulfillerShare / total) * 100).toFixed(2)),
    designer: Number(((designerShare / total) * 100).toFixed(2)),
    grantee: Number(((granteeShare / total) * 100).toFixed(2)),
  };
};

export default getSplits;
