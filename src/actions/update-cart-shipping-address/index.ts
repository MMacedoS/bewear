"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UpdateCartShippingAddressSchema } from "./schema";

export async function updateCartShippingAddress(
  data: UpdateCartShippingAddressSchema
) {
  try {
    // Verificar autenticação
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const { shippingAddressId } = data;

    // Buscar o carrinho do usuário
    const cart = await db
      .select()
      .from(cartTable)
      .where(eq(cartTable.user_id, session.user.id))
      .limit(1);

    if (!cart.length) {
      throw new Error("Carrinho não encontrado");
    }

    // Atualizar o endereço de entrega do carrinho
    await db
      .update(cartTable)
      .set({
        shipping_address_id: shippingAddressId,
      })
      .where(eq(cartTable.id, cart[0].id));

    return {
      success: true,
      message: "Endereço de entrega atualizado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao atualizar endereço do carrinho:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erro ao atualizar endereço do carrinho"
    );
  }
}
