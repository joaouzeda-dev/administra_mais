import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [responsible, setResponsible] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEditar = () => {
    setIsEditing(true);
  };

  const handleSalvar = () => {
    if (!companyName.trim() || !responsible.trim() || !email.trim() || !phone.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (password && password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Perfil atualizado com sucesso",
    });

    setIsEditing(false);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Perfil</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="companyName" className="text-foreground">Nome da empresa:</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="responsible" className="text-foreground">Responsável:</Label>
            <Input
              id="responsible"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-foreground">Email:</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              type="email"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-foreground">Celular:</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-foreground">Senha:</Label>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!isEditing}
              type="password"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-foreground">Confirmação de senha:</Label>
            <Input
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!isEditing}
              type="password"
              className="mt-1"
            />
          </div>

          {!isEditing ? (
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleEditar}
            >
              Editar
            </Button>
          ) : (
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleSalvar}
            >
              Salvar
            </Button>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
