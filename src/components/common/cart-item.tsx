import Image from "next/image";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { formatCentsToBRL } from "@/helpers/money";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeProductToCart } from "@/actions/remove-cart-product";
import { toast } from "sonner";

interface productActionsProps {
  id: string;
  product_name: string;
  product_variant_name: string;
  product_variant_image_url: string;
  product_variant_price_in_cents: number;
  quantity: number;
}

const CartItem = ({
  id,
  product_name,
  product_variant_name,
  product_variant_image_url,
  product_variant_price_in_cents,
  quantity,
}: productActionsProps) => {
  const queryClient = useQueryClient();

  const removeProductToCartMutation = useMutation({
    mutationKey: ["remove-cart-product"],
    mutationFn: () => removeProductToCart({ cart_item_id: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleDeleteClick = () => {
    removeProductToCartMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("produto removido do carrinho");
      },
      onError(error, variables, context) {
        toast.error("erro ao tentar remover o produto do carrinho.");
      },
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={product_variant_image_url}
          alt={product_variant_name}
          width={78}
          height={78}
          className="rounded-lg"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{product_name}</p>
          <p className="text-muted-foreground text-xs font-medium">
            {product_variant_name}
          </p>
          <div className="flex w-[100px] items-center justify-between rounded-3xl border p-1">
            <Button className="h-4 w-4" variant="ghost" onClick={() => {}}>
              <MinusIcon />
            </Button>
            <p className="text-xs">{quantity}</p>
            <Button className="h-4 w-4" variant="ghost" onClick={() => {}}>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center gap-2">
        <Button variant="outline" size="icon" onClick={handleDeleteClick}>
          <TrashIcon />
        </Button>
        <p className="text-sm font-bold">
          {formatCentsToBRL(product_variant_price_in_cents * quantity)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
