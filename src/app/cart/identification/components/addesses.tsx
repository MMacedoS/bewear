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
import { Car } from "lucide-react";
import { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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

const formSchema = z.object({
  nomeCompleto: z.string().trim().min(1, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos").max(14, "CPF inválido"),
  cep: z.string().min(8, "CEP deve ter 8 dígitos").max(9, "CEP inválido"),
  celular: z.string().min(10, "Celular deve ter pelo menos 10 dígitos"),
  endereco: z.string().trim().min(1, "Endereço é obrigatório"),
  numero: z.string().trim().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  cidade: z.string().trim().min(1, "Cidade é obrigatória"),
  estado: z
    .string()
    .trim()
    .min(2, "Estado é obrigatório")
    .max(2, "Estado deve ter 2 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

const Addresses = () => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeCompleto: "",
      email: "",
      cpf: "",
      cep: "",
      celular: "",
      endereco: "",
      numero: "",
      complemento: "",
      cidade: "",
      estado: "",
    },
  });

  async function onSubmit(values: FormData) {
    try {
      console.log("Dados do formulário:", values);
      toast.success("Endereço adicionado com sucesso!");
      // Aqui você pode adicionar a lógica para salvar o endereço
    } catch (error) {
      toast.error("Erro ao adicionar endereço");
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
          <Card className="flex flex-col gap-4">
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add_new" id="add_new" />
                <Label htmlFor="add_new">Adicionar novo endereço</Label>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>

        {selectedAddress === "add_new" && (
          <Card className="mt-4 w-full">
            <CardHeader>
              <CardTitle>Novo Endereço</CardTitle>
              <CardDescription>
                Preencha os dados para adicionar um novo endereço
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
                    name="nomeCompleto"
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
                    name="cpf"
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
                      name="cep"
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
                      name="celular"
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
                    name="endereco"
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

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="numero"
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
                      name="complemento"
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
                      name="cidade"
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
                      name="estado"
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
                  <Button type="submit" className="w-full">
                    Salvar Endereço
                  </Button>
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
