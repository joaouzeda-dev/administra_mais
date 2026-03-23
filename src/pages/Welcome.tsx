import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="text-center space-y-6 animate-in fade-in duration-700">
        <div className="flex items-center justify-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <Plus className="h-20 w-20 text-primary relative" strokeWidth={3} />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Administra<span className="text-primary">+</span>
          </h1>
          <p className="text-xl text-muted-foreground">Bem-vindo!</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
