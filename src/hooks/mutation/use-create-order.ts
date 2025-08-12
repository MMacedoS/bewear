import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/actions/create-order";
import { CreateOrderSchema } from "@/actions/create-order/schema";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderSchema) => createOrder(data),
    onSuccess: () => {
      // Invalidar cache do carrinho para refletir as mudanças
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      // Invalidar cache de pedidos se existir
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};
