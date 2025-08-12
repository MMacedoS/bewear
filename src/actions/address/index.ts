"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createAddressSchema, CreateAddressSchema } from "./schema";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";

export const createAddress = async (data: CreateAddressSchema) => {
  createAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");

  const newAddress = await db
    .insert(shippingAddressTable)
    .values({
      user_id: session.user.id,
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
    })
    .returning();

  return newAddress[0];
};
