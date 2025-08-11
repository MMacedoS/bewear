"use client";

import { Loader2, ShoppingCartIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CartItem from "./cart-item";
import { Separator } from "../ui/separator";
import { formatCentsToBRL } from "@/helpers/money";
import { useCart } from "@/hooks/queries/use-carts";
import Link from "next/link";

const Cart = () => {
  const { data: cart, isPending: isCartLoading } = useCart();

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
        <div className="flex h-full flex-col px-5 pb-5">
          <div className="flex h-full max-h-full flex-col overflow-hidden">
            <div className="h-full">
              <div className="flex h-full flex-col gap-8">
                {isCartLoading && <Loader2 className="animate-spin" />}
                {cart?.items.map((item) => (
                  <div className="w-full" key={item.id}>
                    {
                      <CartItem
                        key={item.id}
                        product_name={item.product_variant.product.name}
                        product_variant_image_url={
                          item.product_variant.image_url
                        }
                        product_variant_name={item.product_variant.name}
                        product_variant_price_in_cents={
                          item.product_variant.price_in_cents
                        }
                        quantity={item.quantity}
                        id={item.id}
                        product_variant_id={item.product_variant.id}
                      />
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>

          {(cart?.items.length ?? 0) > 0 && (
            <div className="flex flex-col gap-4">
              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p>SubTotal</p>
                <p className="text-sm font-bold">
                  {formatCentsToBRL(cart?.totalPriceInCents)}
                </p>
              </div>
              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p>Entrega</p>
                <p className="text-sm font-bold">gratis</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-xs font-medium">
                <p>Total</p>
                <p className="text-sm font-bold">
                  {formatCentsToBRL(cart?.totalPriceInCents)}
                </p>
              </div>

              <Button className="mt-5 rounded-full" asChild>
                <Link href="/cart/identification" className="w-full">
                  Finalizar compra
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
