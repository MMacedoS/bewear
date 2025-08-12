"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import {
  cartTable,
  cartItemsTable,
  orderTable,
  orderItemsTable,
  orderShippingAddressTable,
  shippingAddressTable,
  productVariantsTable,
  productTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { CreateOrderSchema, createOrderSchema } from "./schema";

export async function createOrder(data: CreateOrderSchema) {
  try {
    // Validar dados de entrada
    createOrderSchema.parse(data);

    // Verificar autenticação
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    // Buscar o carrinho do usuário com todos os dados necessários
    const cart = await db.query.cartTable.findFirst({
      where: (c, { eq }) => {
        if (data.cart_id) {
          return eq(c.id, data.cart_id);
        }
        return eq(c.user_id, session.user.id);
      },
      with: {
        shippingAddress: true,
        items: {
          with: {
            product_variant: {
              with: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new Error("Carrinho não encontrado");
    }

    if (!cart.shippingAddress) {
      throw new Error("Endereço de entrega não selecionado");
    }

    if (cart.items.length === 0) {
      throw new Error("Carrinho está vazio");
    }

    // Calcular total do pedido
    const totalAmountInCents = cart.items.reduce((total, item) => {
      return total + item.quantity * item.product_variant.price_in_cents;
    }, 0);

    // Iniciar transação para criar o pedido
    const result = await db.transaction(async (tx) => {
      // 1. Criar snapshot do endereço de entrega
      const [orderShippingAddress] = await tx
        .insert(orderShippingAddressTable)
        .values({
          recipient_name: cart.shippingAddress!.recipient_name,
          street: cart.shippingAddress!.street,
          number: cart.shippingAddress!.number,
          complement: cart.shippingAddress!.complement,
          neighborhood: cart.shippingAddress!.neighborhood,
          zipCode: cart.shippingAddress!.zipCode,
          city: cart.shippingAddress!.city,
          state: cart.shippingAddress!.state,
          country: cart.shippingAddress!.country,
          phone: cart.shippingAddress!.phone,
          email: cart.shippingAddress!.email,
          cpf_or_cnpj: cart.shippingAddress!.cpf_or_cnpj,
        })
        .returning();

      // 2. Criar o pedido
      const [order] = await tx
        .insert(orderTable)
        .values({
          user_id: session.user.id,
          order_shipping_address_id: orderShippingAddress.id,
          total_amount_in_cents: totalAmountInCents,
          status: "pending",
        })
        .returning();

      // 3. Criar snapshot dos itens do pedido
      const orderItems = [];
      for (const cartItem of cart.items) {
        const totalInCents =
          cartItem.quantity * cartItem.product_variant.price_in_cents;

        const [orderItem] = await tx
          .insert(orderItemsTable)
          .values({
            order_id: order.id,
            product_name: cartItem.product_variant.product.name,
            product_variant_name: cartItem.product_variant.name,
            product_variant_color: cartItem.product_variant.color,
            product_variant_image_url: cartItem.product_variant.image_url,
            price_in_cents: cartItem.product_variant.price_in_cents,
            quantity: cartItem.quantity,
            total_in_cents: totalInCents,
            original_product_id: cartItem.product_variant.product.id,
            original_product_variant_id: cartItem.product_variant.id,
          })
          .returning();

        orderItems.push(orderItem);
      }

      // 4. Limpar o carrinho após criar o pedido
      await tx
        .delete(cartItemsTable)
        .where(eq(cartItemsTable.cart_id, cart.id));

      // 5. Remover endereço de entrega do carrinho
      await tx
        .update(cartTable)
        .set({ shipping_address_id: null })
        .where(eq(cartTable.id, cart.id));

      return {
        order,
        orderShippingAddress,
        orderItems,
      };
    });

    return {
      success: true,
      orderId: result.order.id,
      message: "Pedido criado com sucesso",
      data: result,
    };
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    throw new Error(
      error instanceof Error ? error.message : "Erro ao criar pedido"
    );
  }
}
