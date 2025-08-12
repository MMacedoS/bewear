import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCentsToBRL } from "@/helpers/money";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";

interface CartSummaryProps {
  subtotalInCents: number;
  shippingInCents: number;
  totalInCents: number;
  products: Array<{
    id: string;
    productName: string;
    productVariantImageUrl: string;
    productVariantId: string;
    productVariantPriceInCents: number;
    productVariantName: string;
    quantity: number;
  }>;
}

const CartSummary = ({
  subtotalInCents,
  shippingInCents,
  totalInCents,
  products,
}: CartSummaryProps) => {
  return (
    <Card className="w-full py-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Resumo do Carrinho</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs font-medium">
            <p>SubTotal</p>
            <p>{formatCentsToBRL(subtotalInCents)}</p>
          </div>
          <div className="flex items-center justify-between text-xs font-medium">
            <p>Frete</p>
            <p>{formatCentsToBRL(shippingInCents)}</p>
          </div>
          <div className="flex items-center justify-between text-xs font-medium">
            <p>Total</p>
            <p>{formatCentsToBRL(totalInCents)}</p>
          </div>
          <div className="py-3">
            <Separator />
          </div>
          {products.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src={item.productVariantImageUrl}
                  alt={item.productName}
                  width={78}
                  height={78}
                  className="rounded-lg"
                />
                <div>
                  <p className="text-sm font-medium">{item.productName}</p>
                  <p className="text-xs text-gray-500">
                    {item.productVariantName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} item(s)
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium">
                {formatCentsToBRL(item.productVariantPriceInCents)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
