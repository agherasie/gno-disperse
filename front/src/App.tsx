import ConnectWallet from "./molecules/ConnectWallet";
import { useAccountStore } from "./store";
import SendForm from "./molecules/SendForm";

function App() {
  const { account } = useAccountStore();

  return (
    <div className="p-10 md:p-20 xl:p-30 w-full lg:w-2/3 xl:w-1/2 m-auto">
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
        {!!account && <SendForm />}
      </div>
    </div>
  );
}

export default App;