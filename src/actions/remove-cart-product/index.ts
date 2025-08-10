"use server";
import { RemoveProductToCartSchema, removeProductToCartSchema } from "./schema";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { cartItemsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const removeProductToCart = async (data: RemoveProductToCartSchema) => {
  removeProductToCartSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");

  const cartItem = await db.query.cartItemsTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, data.cart_item_id),
    with: {
      cart: true,
    },
  });

  if (cartItem?.cart.user_id !== session.user.id) {
    throw new Error("Unauthorized");
  }

  if (!cartItem) {
    throw new Error("Product variant not found in cart");
  }

  await db.delete(cartItemsTable).where(eq(cartItemsTable.id, cartItem.id));
};
