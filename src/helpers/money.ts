export const formatCentsToBRL = (Cents: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Cents / 100);
};
