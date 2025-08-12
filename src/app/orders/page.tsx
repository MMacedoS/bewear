import { getUserOrders } from "@/actions/get-orders";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import OrdersListClient from "./components/orders-list-client";

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/authentication");
  }

  const initialOrders = await getUserOrders();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>
          <p className="text-gray-600 mt-2">
            Acompanhe o status dos seus pedidos e veja o histórico de compras.
          </p>
        </div>

        <OrdersListClient initialOrders={initialOrders} />
      </div>
    </div>
  );
}
