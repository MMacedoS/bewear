import { updateAddress } from "@/actions/address/update-address";
import { UpdateAddressSchema } from "@/actions/address/update-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USE_ADDRESSES_QUERY_KEY } from "../queries/use-addresses";

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-address"],
    mutationFn: (data: UpdateAddressSchema) => updateAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USE_ADDRESSES_QUERY_KEY });
    },
  });
};
