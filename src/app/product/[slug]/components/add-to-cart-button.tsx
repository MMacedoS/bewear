"use client";
import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface AddToCartButtonProps {
  product_variant_id: string;
  quantity: number;
}

const AddToCartButton = ({
  product_variant_id,
  quantity,
}: AddToCartButtonProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["addProductToCart", product_variant_id, quantity],
    mutationFn: () =>
      addProductToCart({
        product_variant_id,
        quantity,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return (
    <Button
      className="rounded-full"
      size="lg"
      variant="outline"
      disabled={isPending}
      onClick={() => mutate()}
    >
      {isPending && <Loader2 className="animate-spin" />}
      Adicionar a sacola
    </Button>
  );
};

export default AddToCartButton;
