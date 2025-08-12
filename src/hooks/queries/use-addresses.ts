import { getUserAddresses } from "@/actions/address/get-addresses";
import { useQuery } from "@tanstack/react-query";

export const USE_ADDRESSES_QUERY_KEY = ["addresses"];

export const useAddresses = () => {
  return useQuery({
    queryKey: USE_ADDRESSES_QUERY_KEY,
    queryFn: getUserAddresses,
  });
};
