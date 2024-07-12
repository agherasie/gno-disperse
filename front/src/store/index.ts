import { GnoWSProvider } from "@gnolang/gno-js-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IAccountInfo } from "../services/adena/adena.types";

const useAccountStore = create<{
  account: IAccountInfo | null;
  setAccount: (address: IAccountInfo | null) => void;
}>((set) => ({
  account: null,
  setAccount: (account) => set({ account }),
}));

const useProviderStore = create<{
  provider: GnoWSProvider | null;
  setProvider: (provider: GnoWSProvider) => void;
}>()(
  persist(
    (set) => ({
      provider: null,
      setProvider: (provider: GnoWSProvider) => set({ provider }),
    }),
    {
      name: "provider-storage",
    }
  )
);

export { useAccountStore, useProviderStore };
