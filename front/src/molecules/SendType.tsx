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
  } = useForm<{ symbol: string }>();

  const onSubmit = handleSubmit(async (data) => {
    const tokenBalance = await provider
      ?.evaluateExpression(
        "gno.land/r/demo/grc20factory",
        `BalanceOf("${data.symbol}", "${account?.address}")`
      )
      .then((res) => +res.split(" ")[0].slice(1))
      .catch((e) => {
        console.log(e);
        setError("symbol", {
          type: "manual",
          message: "invalid address",
        });
        setToken(null);
      });

    if (!tokenBalance) return;

    setToken({
      symbol: data.symbol,
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
            <h2 className="text-2xl italic">token symbol</h2>
            <div className="flex flex-row space-x-4">
              <input
                {...register("symbol")}
                placeholder="TEST"
                className={`w-full p-2 border text-primary bg-secondary outline-none ${
                  errors.symbol && "border-red-500 placeholder:text-red-500"
                }`}
              />
              <button
                type="submit"
                className="text-black italic px-3 py-1 border-none bg-primary shadow-button"
              >
                load
              </button>
            </div>
            {errors.symbol?.type === "manual" && (
              <p className="text-red-500">{errors.symbol.message}</p>
            )}
          </form>
          {token?.balance && (
            <p>you have {displayCoin(token?.balance ?? 0, token?.symbol)}</p>
          )}
        </div>
      )}
      {sendType === SendEnum.GNOT && (
        <p>
          you have{" "}
          {displayBalance(+account!.coins.split("ugnot")[0] / 1_000_000)}
        </p>
      )}
    </div>
  );
};

export default SendType;
