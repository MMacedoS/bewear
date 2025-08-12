"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

interface PaymentActionsProps {
  orderId: string;
}

const PaymentActions = ({ orderId }: PaymentActionsProps) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulatePayment = async () => {
    setIsProcessing(true);

    // Simular delay do processamento do pagamento
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success("Pagamento processado com sucesso!");
    router.push(`/payment/success/${orderId}`);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Forma de Pagamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            Integração com gateway de pagamento será implementada aqui
          </p>
          <p className="text-sm text-muted-foreground">
            (PIX, Cartão de Crédito, Boleto, etc.)
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <CreditCard className="mr-2 h-4 w-4 animate-pulse" />
                Processando...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Simular Pagamento
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/")}
          >
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentActions;
