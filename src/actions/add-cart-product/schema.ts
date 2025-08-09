import z from "zod/v4";

export const addProductToCartSchema = z.object({
  product_variant_id: z.uuid(),
  quantity: z.number().min(1),
});

export type AddProductToCartSchema = z.infer<typeof addProductToCartSchema>;
