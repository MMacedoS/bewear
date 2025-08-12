"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { updateAddressSchema, UpdateAddressSchema } from "./update-schema";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const updateAddress = async (data: UpdateAddressSchema) => {
  updateAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");

  // Verificar se o endereço pertence ao usuário
  const existingAddress = await db.query.shippingAddressTable.findFirst({
    where: (sa, { eq, and }) =>
      and(eq(sa.id, data.id), eq(sa.user_id, session.user.id)),
  });

  if (!existingAddress) {
    throw new Error("Address not found or unauthorized");
  }

  const updatedAddress = await db
    .update(shippingAddressTable)
    .set({
      recipient_name: data.recipient_name,
      email: data.email,
      cpf_or_cnpj: data.cpf_or_cnpj,
      zipCode: data.zipCode,
      phone: data.phone,
      street: data.street,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      country: data.country,
      updated_at: new Date(),
    })
    .where(
      and(
        eq(shippingAddressTable.id, data.id),
        eq(shippingAddressTable.user_id, session.user.id)
      )
    )
    .returning();

  return updatedAddress[0];
};
