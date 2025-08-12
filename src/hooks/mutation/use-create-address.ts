import { createAddress } from "@/actions/address";
import { CreateAddressSchema } from "@/actions/address/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USE_ADDRESSES_QUERY_KEY } from "../queries/use-addresses";

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-address"],
    mutationFn: (data: CreateAddressSchema) => createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USE_ADDRESSES_QUERY_KEY });
    },
  });
};
