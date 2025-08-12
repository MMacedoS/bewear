import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Addresses from "./components/addesses";

const IdentificationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.user_id, session.user.id),
    with: {
      items: true,
      shippingAddress: true,
    },
  });

  if (!cart || cart.items.length === 0) {
    redirect("/");
  }

  return (
    <>
      <div className="px-5">
        <Addresses />
      </div>
    </>
  );
};

export default IdentificationPage;
