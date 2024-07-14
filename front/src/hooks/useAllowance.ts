import { useCallback, useEffect } from "react";
import { constants } from "../constants";
import { AdenaService } from "../services/adena/adena";
import { EMessageType } from "../services/adena/adena.types";
import { useAccountStore, useProviderStore, useTokenStore } from "../store";

const useAllowance = () => {
  const { provider } = useProviderStore();
  const { token, setAllowance } = useTokenStore();
  const { account } = useAccountStore();

  const refreshAllowance = useCallback(
    () =>
      provider
        ?.evaluateExpression(
          "gno.land/r/demo/grc20factory",
          `Allowance("${token?.symbol}", "${account?.address}", "${constants.realmAddress}")`
        )
        .then((res) => setAllowance(+res.split(" ")[0].slice(1))),
    [account?.address, provider, setAllowance, token?.symbol]
  );

  const handleApprove = useCallback(
    (totalAmount: number) => {
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
    },
    [account, refreshAllowance, token]
  );

  useEffect(() => {
    if (!token?.symbol) return;
    refreshAllowance();
  }, [account?.address, provider, refreshAllowance, token?.symbol]);

  return {
    onApprove: handleApprove,
  };
};

export default useAllowance;
