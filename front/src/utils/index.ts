export const displayBalance = (gnot: number) => displayCoin(gnot, "GNOT");

export const displayCoin = (amount: number, symbol: string = "???") => {
  return `${amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })} ${symbol}`;
};
