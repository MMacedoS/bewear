export const formatCentsToBRL = (Cents: number = 0) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Cents / 100);
};
