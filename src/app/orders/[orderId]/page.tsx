import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCEP, formatPhone } from "@/helpers/general";
import { getOrderStatusDisplay } from "@/helpers/order-status";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { orderTable, OrderStatus } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

interface OrderSuccessPageProps {
  params: Promise<{ orderId: string }>;
}

const OrderSuccessPage = async ({ params }: OrderSuccessPageProps) => {
  const { orderId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/");
  }

  // Buscar o pedido com todos os dados
  const order = await db.query.orderTable.findFirst({
    where: (o, { eq, and }) =>
      and(eq(o.id, orderId), eq(o.user_id, session.user.id)),
    with: {
      shippingAddress: true,
      items: true,
    },
  });

  if (!order) {
    redirect("/");
  }

  const statusDisplay = getOrderStatusDisplay(order.status);

  return (
    <div className="space-y-4 px-5 py-8">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-green-700">
          Detalhes do Pedido
        </h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe o status e informações do seu pedido
        </p>
      </div>

      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle>Detalhes do Pedido #{order.id.slice(-8)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Status do Pedido</h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm ${statusDisplay.color}`}
            >
              {statusDisplay.label}
            </span>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Endereço de Entrega</h3>
            <Card>
              <CardContent className="pt-4">
                <div className="flex flex-col gap-1">
                  <div className="font-medium">
                    {order.shippingAddress.recipient_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.shippingAddress.street},{" "}
                    {order.shippingAddress.number}
                    {order.shippingAddress.complement &&
                      `, ${order.shippingAddress.complement}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.shippingAddress.neighborhood},{" "}
                    {order.shippingAddress.city} - {order.shippingAddress.state}
                    , {formatCEP(order.shippingAddress.zipCode)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatPhone(order.shippingAddress.phone)} •{" "}
                    {order.shippingAddress.email}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Itens do Pedido</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product_variant_image_url}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.product_variant_name} -{" "}
                          {item.product_variant_color}
                        </p>
                        <p className="text-sm">
                          Quantidade: {item.quantity} x R${" "}
                          {(item.price_in_cents / 100).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          R$ {(item.total_in_cents / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total do Pedido:</span>
              <span>R$ {(order.total_amount_in_cents / 100).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button asChild className="flex-1">
              <Link href="/">Continuar Comprando</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/orders">Ver Meus Pedidos</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccessPage;
