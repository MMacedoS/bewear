import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/actions/create-order";
import { CreateOrderSchema } from "@/actions/create-order/schema";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderSchema) => createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};
