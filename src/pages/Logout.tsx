import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const Logout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [choice, setChoice] = useState<"sim" | "nao">("nao");
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (choice === "sim") {
      setLoading(true);
      try {
        await signOut();
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso",
        });
        navigate("/login");
      } catch (error) {
        console.error("Erro ao sair:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    } else {
      navigate("/settings");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Logout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 space-y-8">
        <p className="text-center text-foreground text-lg">
          Deseja realmente sair da sua conta?
        </p>

        <RadioGroup value={choice} onValueChange={(value) => setChoice(value as "sim" | "nao")} disabled={loading}>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="sim" id="sim" />
            <Label htmlFor="sim" className="text-foreground cursor-pointer">Sim</Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="nao" id="nao" />
            <Label htmlFor="nao" className="text-foreground cursor-pointer">Não</Label>
          </div>
        </RadioGroup>

        <Button 
          size="lg" 
          className="w-full"
          onClick={handleSalvar}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saindo...
            </>
          ) : (
            "Confirmar"
          )}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Logout;
