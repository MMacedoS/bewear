"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCEP, formatPhone } from "@/helpers/general";
import CartSummary from "../../identification/components/cart-sumary";
import { useCreateOrder } from "@/hooks/mutation/use-create-order";
import { useCart } from "@/hooks/queries/use-carts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getCart } from "@/actions/get-cart";
import { useEffect } from "react";

interface ConfirmationPageClientProps {
  initialCart: Awaited<ReturnType<typeof getCart>>;
}

const ConfirmationPageClient = ({
  initialCart,
}: ConfirmationPageClientProps) => {
  const { data: cart } = useCart({ initialData: initialCart });
  const createOrderMutation = useCreateOrder();
  const router = useRouter();

  // Redirecionar se o carrinho estiver vazio (useEffect para evitar setState durante render)
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      router.push("/");
    }
  }, [cart, router]);

  // Se não há carrinho ou está vazio, mostrar loading enquanto redireciona
  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  async function handleFinishOrder() {
    try {
      const result = await createOrderMutation.mutateAsync({});
      toast.success("Pedido criado com sucesso!");
      // Redirecionar para página de pagamento
      router.push(`/payment/${result.orderId}`);
    } catch (error) {
      toast.error("Erro ao finalizar pedido");
      console.error("Erro:", error);
    }
  }

  return (
    <div className="space-y-4 px-5">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle>Identificação</CardTitle>
        </CardHeader>
        <CardContent>
          {cart.shippingAddress ? (
            <Card>
              <CardContent>
                <div className="flex flex-col gap-1">
                  <div className="font-medium">
                    {cart.shippingAddress.recipient_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {cart.shippingAddress.street}, {cart.shippingAddress.number}
                    {cart.shippingAddress.complement &&
                      `, ${cart.shippingAddress.complement}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {cart.shippingAddress.neighborhood},{" "}
                    {cart.shippingAddress.city} - {cart.shippingAddress.state},{" "}
                    {formatCEP(cart.shippingAddress.zipCode)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatPhone(cart.shippingAddress.phone)} •{" "}
                    {cart.shippingAddress.email}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <div className="text-center text-muted-foreground py-4">
                  Nenhum endereço de entrega selecionado
                </div>
              </CardContent>
            </Card>
          )}
          <Button
            className="w-full rounded-full"
            size="lg"
            onClick={handleFinishOrder}
            disabled={createOrderMutation.isPending || !cart.shippingAddress}
          >
            {createOrderMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando Pedido...
              </>
            ) : (
              "Ir para Pagamento"
            )}
          </Button>
        </CardContent>
      </Card>
      <CartSummary
        subtotalInCents={cart.totalPriceInCents || 0}
        shippingInCents={0}
        totalInCents={cart.totalPriceInCents || 0}
        products={
          cart.items.map((item) => ({
            id: item.id,
            productName: item.product_variant.product.name,
            productVariantImageUrl: item.product_variant.image_url,
            productVariantId: item.product_variant.id,
            productVariantPriceInCents: item.product_variant.price_in_cents,
            productVariantName: item.product_variant.name,
            quantity: item.quantity,
          })) || []
        }
      />
    </div>
  );
};

export default ConfirmationPageClient;
