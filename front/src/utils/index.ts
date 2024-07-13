export const displayBalance = (ugnot: number) => {
  const gnot = ugnot / 1000000;
  return displayCoin(gnot, "GNOT");
};

export const displayCoin = (amount: number, symbol: string = "???") => {
  return `${amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })} ${symbol}`;
};
