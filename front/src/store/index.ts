import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
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
  provider: GnoJSONRPCProvider | null;
  setProvider: (provider: GnoJSONRPCProvider) => void;
}>()(
  persist(
    (set) => ({
      provider: null,
      setProvider: (provider: GnoJSONRPCProvider) => set({ provider }),
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
  symbol: string;
  balance: number;
};

const useTokenStore = create<{
  token: Token | null;
  setToken: (token: Token | null) => void;
  sendType: SendEnum;
  setSendType: (sendType: SendEnum) => void;
  allowance: number;
  setAllowance: (allowance: number) => void;
}>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  updateTokenBalance: (balance: number) =>
    set((state) => ({ token: { ...state.token!, balance } })),
  sendType: SendEnum.GNOT,
  setSendType: (sendType) => set({ sendType }),
  allowance: 0,
  setAllowance: (allowance) => set({ allowance }),
}));

export { useAccountStore, useProviderStore, useTokenStore };
