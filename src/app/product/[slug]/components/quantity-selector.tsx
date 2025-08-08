"use client";

import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useQueryState, parseAsInteger } from "nuqs";

const QuantitySelector = () => {
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
    <div className="space-y-4">
      <h3 className="font-medium">Quantidade</h3>
      <div className="flex w-[100px] items-center justify-between rounded-3lg border">
        <Button size="icon" variant="ghost" onClick={handleDecrement}>
          <MinusIcon />
        </Button>
        <p>{quantity}</p>
        <Button size="icon" variant="ghost" onClick={handleIncrement}>
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
