export default (expr) => {
  const nums = expr.split("+").map((token) => token.trim());
  return {
    op: "+",
    nums,
  };
};
