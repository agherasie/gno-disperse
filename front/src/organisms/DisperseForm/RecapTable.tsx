import { FC } from "react";
import { SendEnum, useTokenStore } from "../../store";
import { displayCoin, displayBalance } from "../../utils";
import ListItem from "../../molecules/ListItem";

export interface RecapTableProps {
  parsedSubmission: { address: string; amount: number }[];
  accountBalance: number;
  totalAmount: number;
}
const RecapTable: FC<RecapTableProps> = ({
  accountBalance,
  parsedSubmission,
  totalAmount,
}) => {
  const { token, sendType } = useTokenStore();

  return (
    <ul className="space-y-2 text-lg">
      <ListItem>
        <i>address</i>
        <i>amount</i>
      </ListItem>
      {parsedSubmission.map(({ address, amount }, i) => (
        <ListItem key={i}>
          <p className="not-italic">{address}</p>
          <div className="w-full border-t-white border-t mt-3 mx-4" />
          <p className="whitespace-nowrap">
            {displayCoin(+amount, token?.symbol ?? "GNOT")}
          </p>
        </ListItem>
      ))}
      <ListItem>
        <i>gas fees</i>
        <p>{displayCoin(1, "GNOT")}</p>
      </ListItem>
      <ListItem>
        <i>total</i>
        <p>{displayCoin(totalAmount, token?.symbol ?? "GNOT")}</p>
      </ListItem>
      <ListItem>
        <i>your balance</i>
        <p>
          {sendType === SendEnum.GNOT
            ? displayBalance(accountBalance)
            : displayCoin(accountBalance, token?.symbol)}
        </p>
      </ListItem>
      <ListItem isError={accountBalance < totalAmount}>
        <i>remaining</i>
        <p>
          {sendType === SendEnum.GNOT
            ? displayBalance(accountBalance - totalAmount)
            : displayCoin(accountBalance - totalAmount, token?.symbol)}
        </p>
      </ListItem>
    </ul>
  );
};

export default RecapTable;
