"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { addProductToCartSchema, AddProductToCartSchema } from "./schema";
import { db } from "@/db";
import { cartItemsTable, cartTable, productVariantsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const addProductToCart = async (data: AddProductToCartSchema) => {
  addProductToCartSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");

  const productVariant = await db.query.productVariantsTable.findFirst({
    where: (pv, { eq }) => eq(pv.id, data.product_variant_id),
  });

  if (!productVariant) throw new Error("Product variant not found");

  let cart = await db.query.cartTable.findFirst({
    where: (c, { eq }) => eq(c.user_id, session.user.id),
  });

  if (!cart) {
    [cart] = await db
      .insert(cartTable)
      .values({ user_id: session.user.id })
      .returning();
  }

  const cartItem = await db.query.cartItemsTable.findFirst({
    where: (ci, { eq, and }) =>
      and(
        eq(ci.cart_id, cart.id),
        eq(ci.product_variant_id, data.product_variant_id)
      ),
  });

  if (cartItem) {
    await db
      .update(cartItemsTable)
      .set({ quantity: data.quantity })
      .where(eq(cartItemsTable.id, cartItem.id));
  } else {
    await db.insert(cartItemsTable).values({
      cart_id: cart.id,
      product_variant_id: data.product_variant_id,
      quantity: data.quantity,
    });
  }
};
