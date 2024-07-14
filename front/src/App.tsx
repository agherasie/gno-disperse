import { useProviderStore } from "./store";
import { GnoWSProvider } from "@gnolang/gno-js-client";
import { useEffect } from "react";
import { constants } from "./constants";
import Home from "./pages";

function App() {
  const { setProvider } = useProviderStore();

  useEffect(() => {
    const provider = new GnoWSProvider(constants.chainRPC);
    setProvider(provider);
  }, [setProvider]);

  return <Home />;
}

export default App;
