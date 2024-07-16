import { from } from "env-var";

const vars = {
  VITE_CHAIN_ID: import.meta.env.VITE_CHAIN_ID,
  VITE_CHAIN_RPC: import.meta.env.VITE_CHAIN_RPC,
  VITE_REALM_PATH: import.meta.env.VITE_REALM_PATH,
  VITE_REALM_ADDRESS: import.meta.env.VITE_REALM_ADDRESS,
};

const env = from(vars, {});

export const constants = {
  chainID: env.get("VITE_CHAIN_ID").default("test4").asString(),
  chainRPC: env
    .get("VITE_CHAIN_RPC")
    .default("https://rpc.test4.gno.land")
    .asString(),
  realmPath: env
    .get("VITE_REALM_PATH")
    .default(
      "gno.land/r/g1w62226g8hykfmtuasvz80rdf0jl6phgxsphh5v/testing/disperse"
    )
    .asString(),
  realmAddress: env
    .get("VITE_REALM_ADDRESS")
    .default("g1yryw6qs8h9anvguu4dfdc0u7zh4gvv8vqf59sj")
    .asString(),
};
