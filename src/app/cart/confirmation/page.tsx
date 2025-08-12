import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCart } from "@/actions/get-cart";
import ConfirmationPageClient from "./components/confirmation-page-client";

const ConfirmationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/");
  }

  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    redirect("/");
  }

  return <ConfirmationPageClient initialCart={cart} />;
};

export default ConfirmationPage;
