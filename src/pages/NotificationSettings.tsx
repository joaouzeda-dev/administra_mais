import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const NotificationSettings = () => {
  const navigate = useNavigate();
  const [notificationEnabled, setNotificationEnabled] = useState<string>(
    localStorage.getItem("notificationsEnabled") || "sim"
  );

  const handleSave = () => {
    localStorage.setItem("notificationsEnabled", notificationEnabled);
    toast({
      title: "Configurações salvas",
      description: "Suas preferências de notificação foram atualizadas.",
    });
    navigate("/settings");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary to-primary/80 pb-20">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-3xl font-bold text-primary-foreground text-center">
            Notificação
          </h1>

          <RadioGroup
            value={notificationEnabled}
            onValueChange={setNotificationEnabled}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <Label
                htmlFor="sim"
                className="text-xl text-primary-foreground cursor-pointer"
              >
                Sim
              </Label>
              <RadioGroupItem
                value="sim"
                id="sim"
                className="h-6 w-6 border-primary-foreground text-primary-foreground"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="nao"
                className="text-xl text-primary-foreground cursor-pointer"
              >
                Não
              </Label>
              <RadioGroupItem
                value="nao"
                id="nao"
                className="h-6 w-6 border-primary-foreground text-primary-foreground"
              />
            </div>
          </RadioGroup>

          <Button
            onClick={handleSave}
            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-14 text-lg rounded-xl"
          >
            Salvar
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default NotificationSettings;
