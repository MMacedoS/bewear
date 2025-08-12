"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getUserOrders() {
  try {
    // Verificar autenticação
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    // Buscar pedidos do usuário com endereço e itens
    const orders = await db.query.orderTable.findMany({
      where: eq(orderTable.user_id, session.user.id),
      with: {
        shippingAddress: true,
        items: true,
      },
      orderBy: [desc(orderTable.created_at)], // Mais recentes primeiro
    });

    return orders;
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    throw new Error(
      error instanceof Error ? error.message : "Erro ao buscar pedidos"
    );
  }
}
