import { FC } from "react";
import { AdenaService } from "../services/adena/adena";
import { constants } from "../constants";
import { IAccountInfo } from "../services/adena/adena.types";
import { useAccountStore } from "../store";

const ConnectWallet: FC = () => {
  const { setAccount, account } = useAccountStore();

  const handleWalletConnect = async () => {
    try {
      await AdenaService.establishConnection("disperse-front");
      const info: IAccountInfo = await AdenaService.getAccountInfo();
      await AdenaService.switchNetwork(constants.chainID);
      setAccount(info);
    } catch (e) {
      console.error(e);
    }
  };

  return account ? (
    <p>logged in as {account?.address}</p>
  ) : (
    <button
      onClick={handleWalletConnect}
      className="text-black italic px-3 py-1 border-none bg-primary shadow-button w-fit"
    >
      connect wallet
    </button>
  );
};

export default ConnectWallet;
