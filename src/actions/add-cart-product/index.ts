"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { addProductToCartSchema, AddProductToCartSchema } from "./schema";
import { db } from "@/db";
import { cartItemsTable, cartTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const addProductToCart = async (data: AddProductToCartSchema) => {
  addProductToCartSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const productVariant = await db.query.productVariantsTable.findFirst({
    where: (productVariant, { eq }) =>
      eq(productVariant.id, data.product_variant_id),
  });

  if (!productVariant) {
    throw new Error("Product variant not found");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.user_id, session.user.id),
  });
  let cartId = cart?.id;
  if (!cartId) {
    const [newCart] = await db
      .insert(cartTable)
      .values({
        user_id: session.user.id,
      })
      .returning();
    cartId = newCart.id;
  }

  const cartItem = await db.query.cartItemsTable.findFirst({
    where: (cartItem, { eq }) =>
      eq(cartItem.cart_id, cartId) &&
      eq(cartItem.product_variant_id, data.product_variant_id),
  });

  if (cartItem) {
    await db
      .update(cartItemsTable)
      .set({
        quantity: (cartItem.quantity = data.quantity),
      })
      .where(eq(cartItemsTable.id, cartItem.id));
    return;
  }

  await db.insert(cartItemsTable).values({
    cart_id: cartId,
    product_variant_id: data.product_variant_id,
    quantity: data.quantity,
  });
};
