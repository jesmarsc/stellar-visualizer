import { useQuery } from "@tanstack/react-query";
import { api, handleResponse } from "..";

import { Network } from "@/types/stellar-beat";

export const getNetwork = (): Promise<Network> => {
  return fetch(`${api.STELLAR_BEAT}`).then(handleResponse);
};

export const useGetNetwork = <SelectType = Network>(options?: {
  select?: (data: Network) => SelectType;
}) => {
  return useQuery({
    queryKey: ["get", "network"],
    queryFn: getNetwork,
    ...options,
  });
};
