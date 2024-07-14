import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  SendEnum,
  useAccountStore,
  useProviderStore,
  useTokenStore,
} from "../store";
import { constants } from "../constants";
import { AdenaService } from "../services/adena/adena";
import { EMessageType } from "../services/adena/adena.types";
import { useForm } from "react-hook-form";
import { displayBalance, displayCoin } from "../utils";

const SUBMISSION_FORMAT = /g1[a-z0-9]+=[0-9]+|\${[a-zA-Z0-9_]+}=[a-zA-Z0-9_]+/g;
type SubmissionType = { address: string; amount: number };

const SendForm: FC = () => {
  const { account, setAccount } = useAccountStore();
  const { token, sendType, setToken } = useTokenStore();
  const { provider } = useProviderStore();

  const {
    reset,
    handleSubmit,
    setError,
    register,
    watch,
    formState: { errors },
  } = useForm<{ submission: string }>({ defaultValues: { submission: "" } });

  const [parsedSubmission, setParsedSubmission] = useState<SubmissionType[]>(
    []
  );

  const watchSubmission = watch("submission");

  const parseSubmission = (submission: string) => {
    if (submission.length === 0 || !submission.match(SUBMISSION_FORMAT)) return;
    const lines = submission.split("\n");
    return lines.map((line) => {
      const [address, amount] = line.split("=");
      return { address, amount: +amount };
    });
  };

  useEffect(() => {
    const parsedSubmission = parseSubmission(watchSubmission);
    if (parsedSubmission) setParsedSubmission(parsedSubmission);
  }, [watchSubmission]);

  const accountBalance = useMemo<number>(
    () =>
      sendType === SendEnum.GNOT
        ? +account!.coins.split("ugnot")[0] / 1_000_000
        : token?.balance ?? 0,
    [account, sendType, token]
  );

  const totalAmount = useMemo<number>(
    () => parsedSubmission.map((v) => v.amount).reduce((a, b) => +a + +b, 0),
    [parsedSubmission]
  );

  const [allowance, setAllowance] = useState<number>(0);
  const refreshAllowance = useCallback(
    () =>
      provider
        ?.evaluateExpression(
          "gno.land/r/demo/grc20factory",
          `Allowance("${token?.symbol}", "${account?.address}", "${constants.realmAddress}")`
        )
        .then((res) => setAllowance(+res.split(" ")[0].slice(1))),
    [account?.address, provider, token?.symbol]
  );

  const handleApprove = useCallback(() => {
    if (token === null || account === null) return;

    AdenaService.sendTransaction(
      [
        {
          type: EMessageType.MSG_CALL,
          value: {
            caller: account.address,
            pkg_path: "gno.land/r/demo/grc20factory",
            send: "",
            func: "Approve",
            args: [
              token.symbol,
              constants.realmAddress,
              totalAmount.toString(),
            ],
          },
        },
      ],
      5000000
    ).then(() => refreshAllowance());
  }, [account, refreshAllowance, token, totalAmount]);

  useEffect(() => {
    refreshAllowance();
  }, [account?.address, provider, refreshAllowance, token?.symbol]);

  const disabledSend = useMemo(
    () =>
      accountBalance < totalAmount ||
      (sendType === SendEnum.TOKEN && allowance === 0),
    [accountBalance, allowance, sendType, totalAmount]
  );

  if (!account) return null;

  const onSubmit = handleSubmit(async (data) => {
    const addresses = parseSubmission(data.submission)?.map((v) => v.address);
    const amounts = parseSubmission(data.submission)?.map((v) => v.amount);

    if (!addresses || !amounts) {
      setError("submission", {
        type: "manual",
        message: "error parsing submission",
      });
      return;
    }

    for (const address of addresses) {
      try {
        await provider?.getAccountNumber(address);
      } catch {
        setError("submission", {
          type: "manual",
          message: "address not found",
        });
        return;
      }
    }

    const { send, func, args } =
      sendType === SendEnum.TOKEN
        ? {
            send: "",
            func: "DisperseTokenString",
            args: [
              token?.symbol as string,
              addresses.toString(),
              amounts.toString(),
            ],
          }
        : {
            send: `${amounts.reduce((a, b) => +a + +b, 0)}ugnot`,
            func: "DisperseGnotString",
            args: [addresses.toString(), amounts.toString()],
          };

    AdenaService.sendTransaction(
      [
        {
          type: EMessageType.MSG_CALL,
          value: {
            caller: account.address,
            pkg_path: constants.realmPath,
            send,
            func,
            args,
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
        setToken(null);
        setParsedSubmission([]);
      });
  });

  if (sendType === SendEnum.TOKEN && token === null) return null;

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-16 w-full">
        <div className="space-y-4 w-full">
          <h2 className="text-2xl italic">recipients and amounts</h2>
          <p>
            enter one address and amount in {token?.symbol ?? "GNOT"} on each
            line. supports any format.
          </p>
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
              placeholder="g1dmt3sa5ucvecxuhf3j6ne5r0e3z4x7h6c03xc0=100"
              {...register("submission", { required: true })}
            />
          </div>
        </div>
        {parsedSubmission.length > 0 && (
          <div className="space-y-4 w-full italic">
            <h2 className="text-2xl italic">confirm</h2>
            <ul className="space-y-2 text-lg">
              <li>
                <div className="flex flex-row justify-between">
                  <i>address</i>
                  <i>amount</i>
                </div>
              </li>
              {parsedSubmission.map(({ address, amount }, i) => (
                <li key={i}>
                  <div className="flex flex-row justify-between">
                    <p className="not-italic">{address}</p>
                    <div className="w-full border-t-white border-t mt-3 mx-4" />
                    <p className="whitespace-nowrap">
                      {displayCoin(+amount, token?.symbol ?? "GNOT")}
                    </p>
                  </div>
                </li>
              ))}
              <li>
                <div className="flex flex-row justify-between">
                  <i>total</i>
                  <p>
                    {displayCoin(
                      parsedSubmission
                        .map((v) => v.amount)
                        .reduce((a, b) => +a + +b, 0),
                      token?.symbol ?? "GNOT"
                    )}
                  </p>
                </div>
              </li>
              <li>
                <div className="flex flex-row justify-between">
                  <i>your balance</i>
                  <p>
                    {sendType === SendEnum.GNOT
                      ? displayBalance(accountBalance)
                      : displayCoin(accountBalance, token?.symbol)}
                  </p>
                </div>
              </li>
              <li>
                <div
                  className={`flex flex-row justify-between ${
                    accountBalance < totalAmount && "text-red-500"
                  }`}
                >
                  <i>remaining</i>
                  <p>
                    {sendType === SendEnum.GNOT
                      ? displayBalance(accountBalance - totalAmount)
                      : displayCoin(
                          accountBalance - totalAmount,
                          token?.symbol
                        )}
                  </p>
                </div>
              </li>
            </ul>

            {sendType === SendEnum.TOKEN && (
              <div className="space-y-2">
                <h2 className="text-2xl italic">allowance</h2>
                <p>allow realm to transfer tokens on your behalf</p>
                <div className="flex flex-row space-x-6 items-center">
                  <button
                    disabled={allowance >= totalAmount}
                    type="button"
                    onClick={handleApprove}
                    className={`text-black italic p-2 border-none bg-primary shadow-button ${
                      allowance >= totalAmount &&
                      "cursor-not-allowed opacity-90 text-opacity-30"
                    }`}
                  >
                    {allowance >= totalAmount ? "approved" : "approve"}
                  </button>
                  {!!errors.root && (
                    <p className="text-red-500">{errors.root?.message}</p>
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-row space-x-6 items-center">
              <button
                disabled={disabledSend}
                className={`text-black italic p-2 border-none bg-primary shadow-button ${
                  disabledSend &&
                  "cursor-not-allowed opacity-90 text-opacity-30"
                }`}
                type="submit"
              >
                disperse {sendType === SendEnum.TOKEN ? "token" : "gnot"}
              </button>
              {disabledSend && (
                <i>
                  {sendType === SendEnum.TOKEN && allowance === 0
                    ? "needs allowance"
                    : "total exceeds balance"}
                </i>
              )}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default SendForm;
