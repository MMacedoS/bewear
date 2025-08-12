import { z } from "zod";

export const UpdateCartShippingAddressSchema = z.object({
  shippingAddressId: z.string().uuid("ID do endereço deve ser um UUID válido"),
});

export type UpdateCartShippingAddressSchema = z.infer<
  typeof UpdateCartShippingAddressSchema
>;
