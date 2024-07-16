import { FC } from "react";
import ConnectWallet from "../molecules/ConnectWallet";
import { constants } from "../constants";

const DisperseHeader: FC = () => (
  <div className="space-y-8 w-full">
    <div className="space-y-4">
      <div className="flex justify-between w-full select-none flex-col sm:flex-row">
        <div className="flex space-x-0">
          <img src="gnolandlogo.png" className="w-10" />
          <div className="flex space-x-2">
            <h1 className="text-4xl">disperse</h1>
            <p className="text-lg">testnet</p>
          </div>
        </div>
        <a href={constants.gnolandURL} className="underline">
          gno.land
        </a>
      </div>
      <p>
        <b>verbe transitif</b> (latin <i>dispersus</i>, de <i>dispergere</i>,
        répandre çà et là)
      </p>
    </div>
    <div className="space-y-2">
      <h2 className="text-2xl italic">connect to wallet</h2>
      <ConnectWallet />
    </div>
  </div>
);

export default DisperseHeader;
