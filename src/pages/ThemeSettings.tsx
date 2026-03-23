import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const ThemeSettings = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "claro"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    
    // Se não há tema salvo, define claro como padrão
    if (!savedTheme) {
      localStorage.setItem("theme", "claro");
      root.classList.remove("dark");
      return;
    }
    
    if (savedTheme === "escuro") {
      root.classList.add("dark");
    } else if (savedTheme === "claro") {
      root.classList.remove("dark");
    } else {
      // Sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("theme", theme);
    
    const root = window.document.documentElement;
    
    if (theme === "escuro") {
      root.classList.add("dark");
    } else if (theme === "claro") {
      root.classList.remove("dark");
    } else {
      // Sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    toast({
      title: "Tema atualizado",
      description: "Suas preferências de tema foram salvas.",
    });
    navigate("/settings");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary to-primary/80 pb-20">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-3xl font-bold text-primary-foreground text-center">
            Tema
          </h1>

          <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <Label
                htmlFor="claro"
                className="text-xl text-primary-foreground cursor-pointer"
              >
                Claro
              </Label>
              <RadioGroupItem
                value="claro"
                id="claro"
                className="h-6 w-6 border-primary-foreground text-primary-foreground"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="escuro"
                className="text-xl text-primary-foreground cursor-pointer"
              >
                Escuro
              </Label>
              <RadioGroupItem
                value="escuro"
                id="escuro"
                className="h-6 w-6 border-primary-foreground text-primary-foreground"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="sistema"
                className="text-xl text-primary-foreground cursor-pointer"
              >
                Sistema
              </Label>
              <RadioGroupItem
                value="sistema"
                id="sistema"
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

export default ThemeSettings;
