import { createContext } from "@/utils/create-context";
// import { useGetNetwork } from "@/api/stellar-beat/get-network";

import { NetworkStore } from "@/stores/network-store";

import data from "@/data.json";

export const [useNetworkStore, _NetworkStoreProvider] =
  createContext<NetworkStore>();

export const NetworkStoreProvider = (props: { children: React.ReactNode }) => {
  // const query = useGetNetwork({ select: (data) => new NetworkStore(data) });

  // if (query.isPending || query.isError) return null;

  return (
    <_NetworkStoreProvider {...props} value={new NetworkStore(data as any)} />
  );
};
