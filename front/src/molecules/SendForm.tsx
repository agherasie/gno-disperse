import { FC } from "react";
import { SendEnum, useAccountStore, useTokenStore } from "../store";
import { constants } from "../constants";
import { AdenaService } from "../services/adena/adena";
import { EMessageType } from "../services/adena/adena.types";
import { useForm } from "react-hook-form";

const SendForm: FC = () => {
  const { account, setAccount } = useAccountStore();
  const { token, sendType } = useTokenStore();

  const {
    reset,
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = useForm<{ submission: string }>();

  if (!account) return null;

  const onSubmit = handleSubmit((data) => {
    const addresses = [];
    const amounts = [];

    const lines = data.submission.split("\n");
    for (const line of lines) {
      const [address, amount] = line.split("=");
      addresses.push(address);
      amounts.push(amount);
    }

    AdenaService.sendTransaction(
      [
        {
          type: EMessageType.MSG_CALL,
          value: {
            caller: account.address,
            send: `${amounts.reduce((a, b) => +a + +b, 0)}ugnot`,
            pkg_path: constants.realmPath,
            func: "DisperseGnotString",
            args: [addresses.toString(), amounts.toString()],
          },
        },
      ],
      5000000
    )
      .catch(() =>
        setError("submission", {
          type: "manual",
          message: "error sending transaction",
        })
      )
      .then((res) => {
        if (!res) return;
        reset();
        AdenaService.getAccountInfo().then((res) => setAccount(res));
      });
  });

  if (sendType === SendEnum.TOKEN && token === null) return null;

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-2xl italic">recipients and amounts</h2>
      <p>
        enter one address and amount in {token?.symbol ?? "GNOT"} on each line.
        supports any format.
      </p>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-0">
          {errors.submission?.type === "required" && (
            <p className="text-red-500">this field is required</p>
          )}
          {errors.submission?.type === "manual" && (
            <p className="text-red-500">{errors.submission.message}</p>
          )}
          <textarea
            className={`w-full h-32 p-2 border text-primary bg-secondary outline-none ${
              errors.submission
                ? "border-red-500 placeholder:text-red-500"
                : "border-primary"
            }`}
            placeholder="0x1234=100"
            {...register("submission", { required: true })}
          />
        </div>
        <button
          className="w-full text-black italic px-3 py-1 border-none bg-primary shadow-button"
          type="submit"
        >
          send
        </button>
      </form>
    </div>
  );
};

export default SendForm;
