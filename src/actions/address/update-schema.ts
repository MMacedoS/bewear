import z from "zod";

export const updateAddressSchema = z.object({
  id: z.string().uuid(),
  recipient_name: z.string().trim().min(1, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  cpf_or_cnpj: z.string().min(11, "CPF deve ter 11 dígitos"),
  zipCode: z.string().min(8, "CEP deve ter 8 dígitos"),
  phone: z.string().min(10, "Celular deve ter pelo menos 10 dígitos"),
  street: z.string().trim().min(1, "Endereço é obrigatório"),
  number: z.string().trim().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().trim().min(1, "Bairro é obrigatório"),
  city: z.string().trim().min(1, "Cidade é obrigatória"),
  state: z
    .string()
    .trim()
    .min(2, "Estado é obrigatório")
    .max(2, "Estado deve ter 2 caracteres"),
  country: z.string().default("Brasil"),
});

export type UpdateAddressSchema = z.infer<typeof updateAddressSchema>;
