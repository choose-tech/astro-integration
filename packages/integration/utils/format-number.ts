export const formatNumber = (n: number): string =>
  new Intl.NumberFormat("en-US", { notation: "compact" }).format(n);
// n >= 1000 ? `${Math.round(n / 100) / 10}k` : `${n}`;
