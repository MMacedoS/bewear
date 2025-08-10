"use server";

import { db } from "@/db";
import {
  cartItemsTable,
  cartTable,
  productTable,
  productVariantsTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type CartWithItems = typeof cartTable.$inferSelect & {
  items: (typeof cartItemsTable.$inferSelect & {
    product_variant: typeof productVariantsTable.$inferSelect & {
      product: typeof productTable.$inferSelect;
    };
  })[];
  totalQuantity: number;
  totalPriceInCents: number;
};

export const getCart = async (): Promise<CartWithItems | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");

  const cart = await db.query.cartTable.findFirst({
    where: (c, { eq }) => eq(c.user_id, session.user.id),
  });

  // Se não existir carrinho, cria um vazio
  if (!cart) {
    const [newCart] = await db
      .insert(cartTable)
      .values({
        user_id: session.user.id,
      })
      .returning();
    return {
      ...newCart,
      items: [],
      totalQuantity: 0,
      totalPriceInCents: 0,
    };
  }

  // Busca os itens do carrinho com produto e variante
  const items = await db.query.cartItemsTable.findMany({
    where: (ci, { eq }) => eq(ci.cart_id, cart.id),
    with: {
      product_variant: {
        with: {
          product: true,
        },
      },
    },
  });

  // Calcula totais
  const { totalQuantity, totalPriceInCents } = items.reduce(
    (acc, item) => {
      acc.totalQuantity += item.quantity;
      acc.totalPriceInCents +=
        item.quantity * item.product_variant.price_in_cents;
      return acc;
    },
    { totalQuantity: 0, totalPriceInCents: 0 }
  );

  return {
    ...cart,
    items,
    totalQuantity,
    totalPriceInCents,
  };
};
