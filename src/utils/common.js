export const formatNumber = (number) => {
  const maximumFractionDigits = number % 1 === 0 ? 0 : 2;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits,
    signDisplay: false,
  }).format(number);
};
