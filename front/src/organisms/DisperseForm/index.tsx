import { FC, useEffect, useMemo, useState } from "react";
import {
  SendEnum,
  useAccountStore,
  useProviderStore,
  useTokenStore,
} from "../../store";
import { constants } from "../../constants";
import { AdenaService } from "../../services/adena/adena";
import { EMessageType } from "../../services/adena/adena.types";
import { FormProvider, useForm } from "react-hook-form";
import Button from "../../molecules/Button";
import RecapTable from "./RecapTable";
import RecipientsAndAmounts from "./RecipientsAndAmounts";
import SendAllowance from "./SendAllowance";

const SUBMISSION_FORMAT = /g1[a-z0-9]+=[0-9]+|\${[a-zA-Z0-9_]+}=[a-zA-Z0-9_]+/g;
type SubmissionType = { address: string; amount: number };

const DisperseForm: FC = () => {
  const { account, setAccount } = useAccountStore();
  const { token, sendType, setToken, allowance } = useTokenStore();
  const { provider } = useProviderStore();

  const methods = useForm<{ submission: string }>({
    defaultValues: { submission: "" },
  });
  const { reset, handleSubmit, setError, watch } = methods;

  const [parsedSubmission, setParsedSubmission] = useState<SubmissionType[]>(
    []
  );

  const watchSubmission = watch("submission");

  const parseSubmission = (submission: string) => {
    if (submission.length === 0 || !submission.match(SUBMISSION_FORMAT)) return;
    const lines = submission.split("\n");
    return lines
      .filter((line) => {
        const [address, amount] = line.split("=");
        return !!address && !!amount;
      })
      .map((line) => {
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

  const disabledSend = useMemo(
    () =>
      accountBalance < totalAmount ||
      (sendType === SendEnum.TOKEN && allowance === 0),
    [accountBalance, allowance, sendType, totalAmount]
  );

  const onSubmit = handleSubmit(async (data) => {
    const addresses = parseSubmission(data.submission)?.map((v) => v.address);
    const amounts = parseSubmission(data.submission)?.map(
      (v) => v.amount * 1_000_000
    );

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
            caller: account!.address,
            pkg_path: constants.realmPath,
            send,
            func,
            args,
          },
        },
      ],
      5000000
    )
      .catch((e) => {
        console.error(e);
        setError("submission", {
          type: "manual",
          message: "error sending transaction",
        });
      })
      .then((res) => {
        if (!res) return;
        reset();
        AdenaService.getAccountInfo().then((res) => setAccount(res));
        setToken(null);
        setParsedSubmission([]);
      });
  });

  if ((sendType === SendEnum.TOKEN && token === null) || !account) return null;

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FormProvider {...methods}>
        <div className="space-y-16 w-full">
          <RecipientsAndAmounts />
          {parsedSubmission.length > 0 && (
            <div className="space-y-4 w-full italic">
              <h2 className="text-2xl italic">confirm</h2>
              <RecapTable
                accountBalance={accountBalance}
                parsedSubmission={parsedSubmission}
                totalAmount={totalAmount}
              />
              {sendType === SendEnum.TOKEN && (
                <SendAllowance
                  totalAmount={totalAmount}
                  accountBalance={accountBalance}
                />
              )}
              <Button
                type="submit"
                isDisabled={disabledSend}
                helperText={
                  disabledSend
                    ? sendType === SendEnum.TOKEN && allowance === 0
                      ? "needs allowance"
                      : "total exceeds balance"
                    : undefined
                }
              >
                disperse {sendType === SendEnum.TOKEN ? "token" : "gnot"}
              </Button>
            </div>
          )}
        </div>
      </FormProvider>
    </form>
  );
};

export default DisperseForm;
