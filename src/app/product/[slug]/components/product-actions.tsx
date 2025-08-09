"use client";

import { Button } from "@/components/ui/button";
import AddToCartButton from "./add-to-cart-button";
import { parseAsInteger, useQueryState } from "nuqs";
import { MinusIcon, PlusIcon } from "lucide-react";

interface productActionsProps {
  product_variant_id: string;
}

const ProductActions = ({ product_variant_id }: productActionsProps) => {
  const [quantity, setQuantity] = useQueryState(
    "quantity",
    parseAsInteger.withDefault(1).withOptions({
      history: "replace",
      shallow: true,
    })
  );

  const handleDecrement = () => {
    setQuantity((prev) => {
      const newValue = prev > 1 ? prev - 1 : prev;
      return newValue === 1 ? null : newValue;
    });
  };

  const handleIncrement = () => {
    setQuantity((prev) => {
      const newValue = prev + 1;
      return newValue === 1 ? null : newValue;
    });
  };

  return (
    <>
      <div className="px-5">
        <div className="space-y-4">
          <h3 className="font-medium">Quantidade</h3>
          <div className="flex w-[100px] items-center justify-between rounded-3xl border">
            <Button size="icon" variant="ghost" onClick={handleDecrement}>
              <MinusIcon />
            </Button>
            <p>{quantity}</p>
            <Button size="icon" variant="ghost" onClick={handleIncrement}>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="px-5 space-y-4 flex flex-col">
        <AddToCartButton
          product_variant_id={product_variant_id}
          quantity={quantity}
        />
        <Button className="rounded-full" size="lg">
          Compre agora
        </Button>
      </div>
    </>
  );
};

export default ProductActions;
