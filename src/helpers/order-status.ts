import { OrderStatus } from "@/db/schema";

// Função utilitária para formatar status do pedido
export const getOrderStatusDisplay = (status: OrderStatus) => {
  const statusMap = {
    pending: {
      label: "Pendente",
      color: "bg-yellow-100 text-yellow-800",
      description: "Pedido recebido e aguardando confirmação",
    },
    confirmed: {
      label: "Confirmado",
      color: "bg-blue-100 text-blue-800",
      description: "Pedido confirmado e sendo preparado",
    },
    shipped: {
      label: "Enviado",
      color: "bg-purple-100 text-purple-800",
      description: "Pedido enviado para entrega",
    },
    delivered: {
      label: "Entregue",
      color: "bg-green-100 text-green-800",
      description: "Pedido entregue com sucesso",
    },
    cancelled: {
      label: "Cancelado",
      color: "bg-red-100 text-red-800",
      description: "Pedido cancelado",
    },
  };

  return (
    statusMap[status] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
      description: "Status desconhecido",
    }
  );
};

// Lista de todos os status para uso em formulários/seletores
export const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Pendente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregue" },
  { value: "cancelled", label: "Cancelado" },
] as const;
