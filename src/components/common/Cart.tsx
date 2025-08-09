"use client";

import { ShoppingCartIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/actions/get-cart";
import Image from "next/image";

const Cart = () => {
  const { data: cart, isPending: isCartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingCartIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="font-semibold text-lg">
            Carrinho de Compras
          </SheetTitle>
        </SheetHeader>
        {isCartLoading && <div>...carregando</div>}
        <div>
          {cart?.items.map((item) => (
            <div key={item.id}>
              {
                <Image
                  src={item.product_variant.image_url}
                  alt={item.product_variant.product.name}
                  width={100}
                  height={100}
                />
              }
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
