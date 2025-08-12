"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Car, Loader2, Edit } from "lucide-react";
import { useState, useEffect } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { PatternFormat } from "react-number-format";
import { useCreateAddress } from "@/hooks/mutation/use-create-address";
import { useUpdateAddress } from "@/hooks/mutation/use-update-address";
import { useUpdateCartShippingAddress } from "@/hooks/mutation/use-update-cart-shipping-address";
import { useAddresses } from "@/hooks/queries/use-addresses";
import { CreateAddressSchema } from "@/actions/address/schema";
import { useCart } from "@/hooks/queries/use-carts";
import CartSummary from "./cart-sumary";
import { useRouter } from "next/navigation";
import { formatCEP, formatPhone } from "@/helpers/general";

// Schema específico para o formulário
const formSchema = z.object({
  recipient_name: z.string().trim().min(1, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  cpf_or_cnpj: z.string().min(11, "CPF deve ter 11 dígitos"),
  zipCode: z.string().min(8, "CEP deve ter 8 dígitos"),
  phone: z.string().min(10, "Celular deve ter pelo menos 10 dígitos"),
  street: z.string().trim().min(1, "Endereço é obrigatório"),
  number: z.string().trim().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().trim().min(1, "Bairro é obrigatório"),
  city: z.string().trim().min(1, "Cidade é obrigatória"),
  state: z
    .string()
    .trim()
    .min(2, "Estado é obrigatório")
    .max(2, "Estado deve ter 2 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

const Addresses = () => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const updateCartShippingAddressMutation = useUpdateCartShippingAddress();
  const { data: addresses, isLoading } = useAddresses();
  const { data: cart } = useCart();

  const router = useRouter();

  // Se o carrinho já tiver um endereço vinculado, selecioná-lo por padrão
  useEffect(() => {
    if (cart?.shipping_address_id && !selectedAddress) {
      setSelectedAddress(cart.shipping_address_id);
    }
  }, [cart?.shipping_address_id, selectedAddress]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient_name: "",
      email: "",
      cpf_or_cnpj: "",
      zipCode: "",
      phone: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  async function onSubmit(values: FormData) {
    try {
      const baseData = {
        ...values,
        cpf_or_cnpj: values.cpf_or_cnpj.replace(/\D/g, ""), // Remove formatação
        zipCode: values.zipCode.replace(/\D/g, ""), // Remove formatação
        phone: values.phone.replace(/\D/g, ""), // Remove formatação
        country: "Brasil",
      };

      if (editingAddressId) {
        // Atualizar endereço existente
        await updateAddressMutation.mutateAsync({
          id: editingAddressId,
          ...baseData,
        });
        toast.success("Endereço atualizado com sucesso!");
        setEditingAddressId(null);
      } else {
        // Criar novo endereço
        await createAddressMutation.mutateAsync(
          baseData as CreateAddressSchema
        );
        toast.success("Endereço adicionado com sucesso!");
      }

      form.reset();
      setSelectedAddress(null);
    } catch (error) {
      toast.error(
        editingAddressId
          ? "Erro ao atualizar endereço"
          : "Erro ao adicionar endereço"
      );
      console.error("Erro:", error);
    }
  }

  function handleEditAddress(address: any) {
    setEditingAddressId(address.id);
    setSelectedAddress("add_new");

    // Preencher o formulário com os dados do endereço
    form.reset({
      recipient_name: address.recipient_name,
      email: address.email,
      cpf_or_cnpj: address.cpf_or_cnpj,
      zipCode: address.zipCode,
      phone: address.phone,
      street: address.street,
      number: address.number,
      complement: address.complement || "",
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
    });
  }

  function handleAddNewAddress() {
    setEditingAddressId(null);
    setSelectedAddress("add_new");
    form.reset();
  }

  async function handleGoToPayment() {
    if (!selectedAddress || selectedAddress === "add_new") {
      toast.error("Selecione um endereço para continuar");
      return;
    }

    try {
      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: selectedAddress,
      });
      toast.success("Endereço vinculado ao carrinho com sucesso!");
      router.push("/cart/confirmation");
    } catch (error) {
      toast.error("Erro ao vincular endereço ao carrinho");
      console.error("Erro:", error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-4 w-4" />
          Endereços
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
          {/* Lista de endereços existentes */}
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : addresses && addresses.length > 0 ? (
            addresses.map((address) => (
              <Card key={address.id} className="flex flex-col gap-2">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={address.id} id={address.id} />
                    <Label
                      htmlFor={address.id}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="font-medium">
                          {address.recipient_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {address.street}, {address.number}
                          {address.complement && `, ${address.complement}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {address.neighborhood}, {address.city} -{" "}
                          {address.state}, {formatCEP(address.zipCode)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatPhone(address.phone)} • {address.email}
                        </div>
                      </div>
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                      className="ml-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Nenhum endereço cadastrado
            </div>
          )}

          {/* Opção para adicionar novo endereço */}
          <Card className="flex flex-col gap-4">
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add_new" id="add_new" />
                <Label
                  htmlFor="add_new"
                  className="cursor-pointer"
                  onClick={handleAddNewAddress}
                >
                  Adicionar novo endereço
                </Label>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>

        {/* Botão para ir ao pagamento */}
        {selectedAddress && selectedAddress !== "add_new" && (
          <div className="mt-4 mb-4">
            <Button
              onClick={handleGoToPayment}
              className="w-full"
              size="lg"
              disabled={updateCartShippingAddressMutation.isPending}
            >
              {updateCartShippingAddressMutation.isPending
                ? "Processando..."
                : "Ir para o Pagamento"}
            </Button>
          </div>
        )}

        <CartSummary
          subtotalInCents={cart?.totalPriceInCents || 0}
          shippingInCents={0}
          totalInCents={cart?.totalPriceInCents || 0}
          products={
            cart?.items.map((item) => ({
              id: item.id,
              productName: item.product_variant.product.name,
              productVariantImageUrl: item.product_variant.image_url,
              productVariantId: item.product_variant.id,
              productVariantPriceInCents: item.product_variant.price_in_cents,
              productVariantName: item.product_variant.name,
              quantity: item.quantity,
            })) || []
          }
        />

        {selectedAddress === "add_new" && (
          <Card className="mt-4 w-full">
            <CardHeader>
              <CardTitle>
                {editingAddressId ? "Editar Endereço" : "Novo Endereço"}
              </CardTitle>
              <CardDescription>
                {editingAddressId
                  ? "Atualize os dados do endereço"
                  : "Preencha os dados para adicionar um novo endereço"}
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <CardContent className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="recipient_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite seu nome completo"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite seu email"
                            {...field}
                            type="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cpf_or_cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <PatternFormat
                            format="###.###.###-##"
                            mask="_"
                            placeholder="000.000.000-00"
                            customInput={Input}
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <PatternFormat
                              format="#####-###"
                              mask="_"
                              placeholder="00000-000"
                              customInput={Input}
                              value={field.value}
                              onValueChange={(values) => {
                                field.onChange(values.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Celular</FormLabel>
                          <FormControl>
                            <PatternFormat
                              format="(##) #####-####"
                              mask="_"
                              placeholder="(00) 00000-0000"
                              customInput={Input}
                              value={field.value}
                              onValueChange={(values) => {
                                field.onChange(values.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o endereço" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o bairro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número</FormLabel>
                          <FormControl>
                            <Input placeholder="Número" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="complement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complemento</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Apartamento, casa, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite a cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="UF"
                              {...field}
                              maxLength={2}
                              style={{ textTransform: "uppercase" }}
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      createAddressMutation.isPending ||
                      updateAddressMutation.isPending
                    }
                  >
                    {createAddressMutation.isPending ||
                    updateAddressMutation.isPending
                      ? editingAddressId
                        ? "Atualizando..."
                        : "Salvando..."
                      : editingAddressId
                      ? "Atualizar Endereço"
                      : "Salvar Endereço"}
                  </Button>
                  {editingAddressId && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setEditingAddressId(null);
                        setSelectedAddress(null);
                        form.reset();
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </CardFooter>
              </form>
            </Form>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default Addresses;
