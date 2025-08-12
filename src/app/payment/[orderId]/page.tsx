import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCEP, formatPhone } from "@/helpers/general";
import { getOrderStatusDisplay } from "@/helpers/order-status";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { CreditCard, Clock } from "lucide-react";
import PaymentActions from "./components/payment-actions";

interface PaymentPageProps {
  params: Promise<{ orderId: string }>;
}

const PaymentPage = async ({ params }: PaymentPageProps) => {
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
        <CreditCard className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-blue-700">
          Finalizar Pagamento
        </h1>
        <p className="text-muted-foreground mt-2">
          Complete o pagamento para confirmar seu pedido
        </p>
      </div>

      {/* Resumo do Pedido */}
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Resumo do Pedido #{order.id.slice(-8)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm ${statusDisplay.color}`}
            >
              {statusDisplay.label}
            </span>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Endereço de Entrega</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-col gap-1">
                <div className="font-medium">
                  {order.shippingAddress.recipient_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.shippingAddress.street}, {order.shippingAddress.number}
                  {order.shippingAddress.complement &&
                    `, ${order.shippingAddress.complement}`}
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.shippingAddress.neighborhood},{" "}
                  {order.shippingAddress.city} - {order.shippingAddress.state},{" "}
                  {formatCEP(order.shippingAddress.zipCode)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatPhone(order.shippingAddress.phone)} •{" "}
                  {order.shippingAddress.email}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Itens do Pedido</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                >
                  <img
                    src={item.product_variant_image_url}
                    alt={item.product_name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.product_name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.product_variant_name} - {item.product_variant_color}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {item.quantity}x R${" "}
                      {(item.price_in_cents / 100).toFixed(2)}
                    </p>
                    <p className="font-semibold text-sm">
                      R$ {(item.total_in_cents / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-green-600">
                R$ {(order.total_amount_in_cents / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opções de Pagamento */}
      <PaymentActions orderId={order.id} />
    </div>
  );
};

export default PaymentPage;
