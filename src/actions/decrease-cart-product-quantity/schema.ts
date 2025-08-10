import z from "zod/v4";

export const decreaseCartProductQuantitySchema = z.object({
  cart_item_id: z.uuid(),
});

export type DecreaseCartProductQuantitySchema = z.infer<
  typeof decreaseCartProductQuantitySchema
>;
