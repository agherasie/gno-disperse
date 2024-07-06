import ConnectWallet from "./molecules/ConnectWallet";
import { displayBalance } from "./utils";
import { useAccountStore } from "./store";

function App() {
  const { account } = useAccountStore();

  return (
    <div className="p-10 md:p-20 xl:p-30 w-full lg:w-2/3 xl:w-1/2 m-auto">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between w-full select-none flex-col sm:flex-row">
            <div className="flex space-x-0">
              <img src="gnolandlogo.png" className="w-10" />
              <div className="flex space-x-2">
                <h1 className="text-4xl">disperse</h1>
                <p className="text-lg">testnet</p>
              </div>
            </div>
            <a href="https://gno.land/demo/r/disperse" className="underline">
              gno.land
            </a>
          </div>
          <p>
            <b>verbe transitif</b> (latin <i>dispersus</i>, de <i>dispergere</i>
            , répandre çà et là)
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl italic">connect to wallet</h2>
          <ConnectWallet />
        </div>
        {!!account && (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl italic">send gnot</h2>
              <p>you have {displayBalance(+account.coins.split("ugnot")[0])}</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl italic">recipients and amounts</h2>
              <p>
                enter one address and amount in GNOT on each line. supports any
                format.
              </p>
              <textarea
                className="w-full h-32 p-2 border text-primary bg-secondary border-primary"
                placeholder="0x1234=100"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
