import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Building2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BusinessSettings = () => {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchBusinessSettings();
  }, []);

  const fetchBusinessSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("business_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setBusinessName(data.business_name);
      }
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!businessName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o nome da academia/negócio.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: existing } = await supabase
        .from("business_settings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("business_settings")
          .update({ business_name: businessName.trim() })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("business_settings")
          .insert({ user_id: user.id, business_name: businessName.trim() });

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: "Configurações do negócio salvas com sucesso!",
      });
      navigate("/settings");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col min-h-screen bg-background pb-20">
        <div className="flex items-center justify-center flex-1">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground mb-4"
            onClick={() => navigate("/settings")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold mb-1">Dados do Negócio</h1>
          <p className="text-primary-foreground/80 text-sm">
            Configure as informações da sua academia
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informações do Negócio
            </CardTitle>
            <CardDescription>
              Estas informações serão usadas nas mensagens automáticas enviadas aos alunos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nome da Academia/Negócio *</Label>
              <Input
                id="businessName"
                placeholder="Ex: Academia Força Total"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Este nome aparecerá nas mensagens de lembrete de pagamento
              </p>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSave}
          className="w-full"
          size="lg"
          disabled={loading}
        >
          <Save className="mr-2 h-5 w-5" />
          {loading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default BusinessSettings;
