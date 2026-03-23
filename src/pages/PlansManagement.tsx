import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Check, X } from "lucide-react";

interface Plan {
  id: number;
  type: string;
  value: number;
}

const PlansManagement = () => {
  const navigate = useNavigate();
  const [planType, setPlanType] = useState("");
  const [planValue, setPlanValue] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editType, setEditType] = useState("");
  const [editValue, setEditValue] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const savedPlans = localStorage.getItem("plans");
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    } else {
      const defaultPlans = [
        { id: 1, type: "Mensal", value: 150.00 },
        { id: 2, type: "Trimestral", value: 420.00 },
        { id: 3, type: "Semestral", value: 810.00 },
        { id: 4, type: "Anual", value: 1560.00 },
      ];
      setPlans(defaultPlans);
      localStorage.setItem("plans", JSON.stringify(defaultPlans));
    }
  }, []);

  const handleCadastrar = () => {
    if (!planType.trim() || !planValue.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const value = parseFloat(planValue.replace(",", "."));
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Erro",
        description: "Digite um valor válido",
        variant: "destructive",
      });
      return;
    }

    const newPlan = {
      id: plans.length + 1,
      type: planType,
      value: value,
    };

    const updatedPlans = [...plans, newPlan];
    setPlans(updatedPlans);
    localStorage.setItem("plans", JSON.stringify(updatedPlans));
    setPlanType("");
    setPlanValue("");

    toast({
      title: "Sucesso",
      description: "Plano cadastrado com sucesso",
    });
  };

  const handleEdit = (plan: Plan) => {
    setEditingId(plan.id);
    setEditType(plan.type);
    setEditValue(plan.value.toString());
  };

  const handleSaveEdit = () => {
    if (!editType.trim() || !editValue.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const value = parseFloat(editValue.replace(",", "."));
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Erro",
        description: "Digite um valor válido",
        variant: "destructive",
      });
      return;
    }

    const updatedPlans = plans.map(plan =>
      plan.id === editingId
        ? { ...plan, type: editType, value: value }
        : plan
    );

    setPlans(updatedPlans);
    localStorage.setItem("plans", JSON.stringify(updatedPlans));
    setEditingId(null);
    setEditType("");
    setEditValue("");

    toast({
      title: "Sucesso",
      description: "Plano atualizado com sucesso",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditType("");
    setEditValue("");
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    const updatedPlans = plans.filter(plan => plan.id !== deletingId);
    setPlans(updatedPlans);
    localStorage.setItem("plans", JSON.stringify(updatedPlans));
    setDeletingId(null);

    toast({
      title: "Sucesso",
      description: "Plano excluído com sucesso",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Finanças</h1>
          <p className="text-primary-foreground/80 text-sm">Cadastro de planos</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="planType" className="text-foreground">Tipo de plano:</Label>
            <Input
              id="planType"
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              placeholder="Ex: Mensal, Trimestral..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="planValue" className="text-foreground">Valor do plano:</Label>
            <Input
              id="planValue"
              value={planValue}
              onChange={(e) => setPlanValue(e.target.value)}
              placeholder="0,00"
              className="mt-1"
            />
          </div>

          <Button 
            size="lg" 
            className="w-full"
            onClick={handleCadastrar}
          >
            Cadastrar
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-lg text-foreground">Planos cadastrados:</h3>
          {plans.map((plan, index) => (
            <div key={plan.id} className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card">
              {editingId === plan.id ? (
                <>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      placeholder="Tipo do plano"
                      className="h-9"
                    />
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="Valor"
                      className="h-9"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="default"
                      onClick={handleSaveEdit}
                      className="h-9 w-9"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="h-9 w-9"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="text-foreground font-medium">
                      {index + 1}. {plan.type} - R${plan.value.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(plan)}
                      className="h-9 w-9"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(plan.id)}
                      className="h-9 w-9 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <AlertDialog open={deletingId !== null} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o plano "{plans.find(p => p.id === deletingId)?.type}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
};

export default PlansManagement;
