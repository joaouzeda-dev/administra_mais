import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Bell, 
  CreditCard, 
  Palette, 
  LogOut, 
  HelpCircle, 
  Cloud,
  Building2,
  ChevronRight 
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  
  const settingsItems = [
    { icon: User, label: "Perfil", description: "Gerencie suas informações pessoais", path: "/settings/profile" },
    { icon: Building2, label: "Dados do Negócio", description: "Configure informações da academia", path: "/settings/business" },
    { icon: CreditCard, label: "Assinatura", description: "Gerencie seu plano", path: "/settings/subscription" },
    { icon: Bell, label: "Notificações", description: "Configure alertas e avisos", path: "/settings/notifications" },
    { icon: Palette, label: "Tema", description: "Personalize a aparência", path: "/settings/theme" },
    { icon: Cloud, label: "Backup", description: "Backup e restauração de dados", path: "/settings/backup" },
    { icon: HelpCircle, label: "FAQ", description: "Perguntas frequentes", path: "/settings/faq" },
    { icon: HelpCircle, label: "Chatbot", description: "Fale com nosso assistente", path: "/settings/chatbot" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Configurações</h1>
          <p className="text-primary-foreground/80 text-sm">Personalize sua experiência</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configurações gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {settingsItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-between h-auto py-4 px-4"
                onClick={() => navigate(item.path)}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Button>
            ))}
          </CardContent>
        </Card>

        <Button 
          variant="destructive" 
          className="w-full" 
          size="lg"
          onClick={() => navigate("/settings/logout")}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sair da conta
        </Button>

        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Administra+ v1.0.0
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © 2024 Todos os direitos reservados
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
