"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";

export const getUserAddresses = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");

  const addresses = await db.query.shippingAddressTable.findMany({
    where: (sa, { eq }) => eq(sa.user_id, session.user.id),
    orderBy: (sa, { desc }) => [desc(sa.created_at)],
  });

  return addresses;
};
