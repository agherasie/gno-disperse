import { FC } from "react";
import { displayBalance, displayCoin } from "../utils";
import {
  SendEnum,
  useAccountStore,
  useProviderStore,
  useTokenStore,
} from "../store";
import { useForm } from "react-hook-form";

const SendType: FC = () => {
  const { account } = useAccountStore();
  const { token, setToken, setSendType, sendType } = useTokenStore();
  const { provider } = useProviderStore();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<{ tokenAddress: string }>();

  const onSubmit = handleSubmit(async (data) => {
    const tokenBalance = await provider
      ?.evaluateExpression(
        data.tokenAddress,
        `BalanceOf("${account?.address}")`
      )
      .then((res) => +res.split(" ")[0].slice(1))
      .catch(() => {
        setError("tokenAddress", {
          type: "manual",
          message: "invalid address",
        });
        setToken(null);
      });
    const tokenName = await provider
      ?.evaluateExpression(data.tokenAddress, `GetName()`)
      .then((res) => res.split('"')[1]);
    const tokenSymbol = await provider
      ?.evaluateExpression(data.tokenAddress, `GetSymbol()`)
      .then((res) => res.split('"')[1]);

    if (!tokenBalance) return;

    setToken({
      address: data.tokenAddress,
      name: tokenName!,
      symbol: tokenSymbol!,
      balance: tokenBalance,
    });
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl italic select-none">
        send{" "}
        <u
          onClick={() => {
            setSendType(SendEnum.GNOT);
            setToken(null);
          }}
          className={`cursor-pointer ${
            sendType === SendEnum.GNOT && "bg-tertiary"
          }`}
        >
          gnot
        </u>{" "}
        or{" "}
        <u
          onClick={() => setSendType(SendEnum.TOKEN)}
          className={`cursor-pointer ${
            sendType === SendEnum.TOKEN && "bg-tertiary"
          }`}
        >
          token
        </u>{" "}
      </h2>
      {sendType === SendEnum.TOKEN && (
        <div className="space-y-4">
          <form onSubmit={onSubmit} className="space-y-2">
            <h2 className="text-2xl italic">token address</h2>
            <div className="flex flex-row space-x-4">
              <input
                {...register("tokenAddress")}
                placeholder="gno.land/r/demo/foo20"
                className={`w-full p-2 border text-primary bg-secondary outline-none ${
                  errors.tokenAddress &&
                  "border-red-500 placeholder:text-red-500"
                }`}
              />
              <button
                type="submit"
                className="text-black italic px-3 py-1 border-none bg-primary shadow-button"
              >
                load
              </button>
            </div>
            {errors.tokenAddress?.type === "manual" && (
              <p className="text-red-500">{errors.tokenAddress.message}</p>
            )}
          </form>
          {token?.balance && (
            <p>
              you have {displayCoin(token?.balance ?? 0, token?.symbol)} (
              {token?.name})
            </p>
          )}
        </div>
      )}
      {sendType === SendEnum.GNOT && (
        <p>you have {displayBalance(+account!.coins.split("ugnot")[0])}</p>
      )}
    </div>
  );
};

export default SendType;
