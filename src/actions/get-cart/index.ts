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
};

export const getCart = async (): Promise<CartWithItems | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");

  const cart = await db.query.cartTable.findFirst({
    where: (c, { eq }) => eq(c.user_id, session.user.id),
  });

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
    };
  }

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

  return { ...cart, items };
};
