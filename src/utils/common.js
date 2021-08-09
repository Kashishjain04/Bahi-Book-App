export const formatNumber = (number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumSignificantDigits: 16,
    signDisplay: false,
  }).format(number);
