import { z } from "zod";

export const createOrderSchema = z.object({
  // Opcionalmente pode receber cart_id, senão usa o carrinho atual do usuário
  cart_id: z.string().uuid().optional(),
});

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
