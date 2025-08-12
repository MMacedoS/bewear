"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCEP, formatPhone } from "@/helpers/general";
import { getOrderStatusDisplay } from "@/helpers/order-status";
import { useOrders } from "@/hooks/queries/use-orders";
import { getUserOrders } from "@/actions/get-orders";
import Link from "next/link";
import {
  Package,
  Calendar,
  MapPin,
  Eye,
  Loader2,
  CreditCard,
} from "lucide-react";

interface OrdersListClientProps {
  initialOrders: Awaited<ReturnType<typeof getUserOrders>>;
}

const OrdersListClient = ({ initialOrders }: OrdersListClientProps) => {
  const { data: orders, isLoading } = useOrders({ initialData: initialOrders });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="w-full mx-auto max-w-2xl">
        <CardContent className="pt-8">
          <div className="text-center space-y-4">
            <Package className="w-16 h-16 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Nenhum pedido encontrado
              </h3>
              <p className="text-gray-500 mt-2">
                Você ainda não fez nenhum pedido. Que tal começar suas compras?
              </p>
            </div>
            <Button asChild>
              <Link href="/">Começar a Comprar</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const statusDisplay = getOrderStatusDisplay(order.status);
        const orderDate = new Date(order.created_at).toLocaleDateString(
          "pt-BR",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );

        return (
          <Card key={order.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Pedido #{order.id.slice(-8)}
                </CardTitle>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${statusDisplay.color}`}
                >
                  {statusDisplay.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {orderDate}
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "itens"}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Endereço de Entrega */}
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Endereço de Entrega
                </h4>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="font-medium">
                    {order.shippingAddress.recipient_name}
                  </div>
                  <div className="text-muted-foreground">
                    {order.shippingAddress.street},{" "}
                    {order.shippingAddress.number}
                    {order.shippingAddress.complement &&
                      `, ${order.shippingAddress.complement}`}
                  </div>
                  <div className="text-muted-foreground">
                    {order.shippingAddress.neighborhood},{" "}
                    {order.shippingAddress.city} - {order.shippingAddress.state}
                  </div>
                  <div className="text-muted-foreground">
                    {formatCEP(order.shippingAddress.zipCode)}
                  </div>
                </div>
              </div>

              {/* Itens do Pedido */}
              <div>
                <h4 className="font-medium text-sm mb-2">Itens</h4>
                <div className="space-y-2">
                  {order.items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"
                    >
                      <img
                        src={item.product_variant_image_url}
                        alt={item.product_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">
                          {item.product_name}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {item.product_variant_name} -{" "}
                          {item.product_variant_color}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qtd: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          R$ {(item.total_in_cents / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {order.items.length > 3 && (
                    <div className="text-center text-sm text-muted-foreground py-2">
                      +{order.items.length - 3}{" "}
                      {order.items.length - 3 === 1 ? "item" : "itens"}{" "}
                      adicional{order.items.length - 3 === 1 ? "" : "is"}
                    </div>
                  )}
                </div>
              </div>

              {/* Total e Ações */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <span className="text-lg font-bold">
                    Total: R$ {(order.total_amount_in_cents / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  {order.status === "pending" && (
                    <Button asChild size="sm">
                      <Link href={`/payment/${order.id}`}>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pagar Agora
                      </Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/orders/${order.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OrdersListClient;
