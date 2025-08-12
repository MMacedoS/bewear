export const formatCEP = (cep: string | undefined) => {
  if (!cep) return "";
  return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
};

export const formatPhone = (phone: string | undefined) => {
  if (!phone) return "";
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};
