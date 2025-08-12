import { getCart } from "@/actions/get-cart";
import { useQuery } from "@tanstack/react-query";

export const USE_CART_QUERY_KEY = ["cart"] as const;

export const useCart = (params?: {
  initialData?: Awaited<ReturnType<typeof getCart>>;
}) => {
  return useQuery({
    queryKey: USE_CART_QUERY_KEY,
    queryFn: () => getCart(),
    initialData: params?.initialData,
  });
};
