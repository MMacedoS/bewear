import { getUserOrders } from "@/actions/get-orders";
import { useQuery } from "@tanstack/react-query";

export const USE_ORDERS_QUERY_KEY = ["orders"] as const;

export const useOrders = (params?: {
  initialData?: Awaited<ReturnType<typeof getUserOrders>>;
}) => {
  return useQuery({
    queryKey: USE_ORDERS_QUERY_KEY,
    queryFn: () => getUserOrders(),
    initialData: params?.initialData,
  });
};
