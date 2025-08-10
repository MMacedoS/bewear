import z from "zod/v4";

export const removeProductToCartSchema = z.object({
  cart_item_id: z.uuid(),
});

export type RemoveProductToCartSchema = z.infer<
  typeof removeProductToCartSchema
>;
