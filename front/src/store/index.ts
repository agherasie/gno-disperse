import { GnoWSProvider } from "@gnolang/gno-js-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IAccountInfo } from "../services/adena/adena.types";

const useAccountStore = create<{
  account: IAccountInfo | null;
  setAccount: (address: IAccountInfo | null) => void;
}>()(
  persist(
    (set) => ({
      account: null,
      setAccount: (account) => set({ account }),
    }),
    {
      name: "account-storage",
    }
  )
);

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

export enum SendEnum {
  GNOT,
  TOKEN,
}

type Token = {
  address: string;
  name: string;
  symbol: string;
  balance: number;
};

const useTokenStore = create<{
  token: Token | null;
  setToken: (token: Token | null) => void;
  sendType: SendEnum;
  setSendType: (sendType: SendEnum) => void;
}>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  updateTokenBalance: (balance: number) =>
    set((state) => ({ token: { ...state.token!, balance } })),
  sendType: SendEnum.GNOT,
  setSendType: (sendType) => set({ sendType }),
}));

export { useAccountStore, useProviderStore, useTokenStore };
