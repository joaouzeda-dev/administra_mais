import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Backup = () => {
  const [lastBackup] = useState("XX:XX");
  const [backupSize] = useState("XXX MB");
  const [backupLocation] = useState("Google Drive");
  const [backupStatus] = useState<"completo" | "incompleto">("completo");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    toast({
      title: "Autenticação Google Drive",
      description: "Abrindo janela de autenticação...",
    });

    // Simulate OAuth flow
    setTimeout(() => {
      setIsLoggedIn(true);
      toast({
        title: "Sucesso",
        description: "Conectado ao Google Drive",
      });
    }, 2000);
  };

  const handleBackup = () => {
    if (!isLoggedIn) {
      toast({
        title: "Erro",
        description: "Faça login no Google Drive primeiro",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Backup iniciado",
      description: "Fazendo backup dos seus dados...",
    });

    setTimeout(() => {
      toast({
        title: "Sucesso",
        description: "Backup realizado com sucesso",
      });
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Backup</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 space-y-8">
        <div className="space-y-4 text-foreground">
          <div className="flex justify-between items-center">
            <span>Último backup:</span>
            <span className="font-medium">{lastBackup}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Tamanho:</span>
            <span className="font-medium">{backupSize}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Salvo em:</span>
            <span className="font-medium">{backupLocation}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Status do backup:</span>
            <span className={`font-medium ${backupStatus === "completo" ? "text-success" : "text-destructive"}`}>
              {backupStatus === "completo" ? "Completo" : "Incompleto"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {!isLoggedIn && (
            <Button 
              size="lg" 
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={handleLogin}
            >
              Login
            </Button>
          )}
          
          <Button 
            size="lg" 
            className="w-full bg-success hover:bg-success/90"
            onClick={handleBackup}
          >
            Fazer Backup
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Backup;
