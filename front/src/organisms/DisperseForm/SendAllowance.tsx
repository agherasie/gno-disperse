import { FC } from "react";
import useAllowance from "../../hooks/useAllowance";
import { useFormContext } from "react-hook-form";
import Button from "../../molecules/Button";
import { DisperseForm } from "./type";
import { useTokenStore } from "../../store";

interface SendAllowanceProps {
  totalAmount: number;
  accountBalance: number;
}
const SendAllowance: FC<SendAllowanceProps> = ({
  totalAmount,
  accountBalance,
}) => {
  const { allowance } = useTokenStore();
  const { onApprove } = useAllowance();

  const {
    formState: { errors },
  } = useFormContext<DisperseForm>();

  return (
    <div className="space-y-2">
      <h2 className="text-2xl italic">allowance</h2>
      <p>allow realm to transfer tokens on your behalf</p>
      <div className="flex flex-row space-x-6 items-center">
        <Button
          isDisabled={allowance >= totalAmount || accountBalance < totalAmount}
          type="button"
          onClick={() => onApprove(totalAmount)}
        >
          {allowance >= totalAmount ? "approved" : "approve"}
        </Button>
        {!!errors.root && (
          <p className="text-red-500">{errors.root?.message}</p>
        )}
      </div>
    </div>
  );
};

export default SendAllowance;
