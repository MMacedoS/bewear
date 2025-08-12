import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { CheckCircle, Package, CreditCard } from "lucide-react";

interface PaymentSuccessPageProps {
  params: Promise<{ orderId: string }>;
}

const PaymentSuccessPage = async ({ params }: PaymentSuccessPageProps) => {
  const { orderId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/");
  }

  // Buscar o pedido para validar se pertence ao usuário
  const order = await db.query.orderTable.findFirst({
    where: (o, { eq, and }) =>
      and(eq(o.id, orderId), eq(o.user_id, session.user.id)),
  });

  if (!order) {
    redirect("/");
  }

  return (
    <div className="space-y-4 px-5 py-8">
      <div className="text-center mb-8">
        <div className="relative mx-auto mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          <CreditCard className="w-8 h-8 text-green-600 absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
        </div>
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Pagamento Confirmado!
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          Seu pedido foi pago com sucesso
        </p>
        <p className="text-sm text-muted-foreground">
          Pedido #{order.id.slice(-8)} • Total: R${" "}
          {(order.total_amount_in_cents / 100).toFixed(2)}
        </p>
      </div>

      <Card className="w-full mx-auto max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Package className="w-5 h-5" />
              <span className="font-medium">Pedido Confirmado</span>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">
                O que acontece agora?
              </h3>
              <ul className="text-sm text-green-700 space-y-1 text-left">
                <li>✓ Seu pagamento foi processado</li>
                <li>✓ Pedido enviado para preparação</li>
                <li>✓ Você receberá atualizações por email</li>
                <li>✓ Acompanhe o status na área de pedidos</li>
              </ul>
            </div>

            <div className="space-y-3 pt-4">
              <Button asChild className="w-full">
                <Link href={`/orders/${order.id}`}>Ver Detalhes do Pedido</Link>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href="/">Continuar Comprando</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Obrigado por comprar conosco! 🎉
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
