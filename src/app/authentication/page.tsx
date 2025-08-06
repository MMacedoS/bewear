import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sign from "./components/sign";
import SignUp from "./components/signup";
import Header from "@/components/common/header";

const Authentication = async () => {
  return (
    <>
      <Header />

      <div className="flex flex-col w-full py-25 items-center">
        <div className="w-full max-w-sm gap-6">
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
      </div>
    </>
  );
};

export default Authentication;
