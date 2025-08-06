import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sign from "./components/sign";
import SignUp from "./components/signup";

const Authentication = async () => {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="justify-center">
        <Tabs defaultValue="login">
          <TabsList className="text-center">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="account">Criar Conta</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Sign />
          </TabsContent>
          <TabsContent value="account">
            <SignUp />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Authentication;
