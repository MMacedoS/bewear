import { removeProductToCart } from "@/actions/remove-cart-product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USE_CART_QUERY_KEY } from "../queries/use-carts";

export const useRemoveProductFromCart = (cart_item_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["remove-cart-product"],
    mutationFn: () => removeProductToCart({ cart_item_id: cart_item_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USE_CART_QUERY_KEY });
    },
  });
};
