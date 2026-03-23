import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Plan {
  id: number;
  type: string;
  value: number;
}

const PAYMENT_METHODS = [
  "Cartão de Crédito",
  "Cartão de Débito",
  "Pix",
  "Dinheiro",
  "Boleto",
  "Transferência Bancária",
];

const EditStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState("Ativo");
  const [isPaid, setIsPaid] = useState(false);
  const [originalIsPaid, setOriginalIsPaid] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const savedPlans = localStorage.getItem("plans");
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }

    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setName(data.name);
        setAge(data.age?.toString() || "");
        setContact(data.contact);
        setStatus(data.status);
        setPaymentMethod(data.payment_method || "");
        setIsPaid(data.payment_status === "Pago");
        setOriginalIsPaid(data.payment_status === "Pago");

        // Find plan by name
        const savedPlans = localStorage.getItem("plans");
        if (savedPlans && data.plan_name) {
          const parsedPlans = JSON.parse(savedPlans);
          const matchingPlan = parsedPlans.find(
            (p: Plan) => p.type === data.plan_name
          );
          if (matchingPlan) {
            setSelectedPlanId(matchingPlan.id.toString());
          }
        }
      }
    } catch (error: any) {
      console.error("Erro ao buscar aluno:", error);
      toast({
        title: "Erro",
        description: "Aluno não encontrado",
        variant: "destructive",
      });
      navigate("/students");
    } finally {
      setFetching(false);
    }
  };

  const selectedPlan = plans.find(p => p.id.toString() === selectedPlanId);

  const handleSalvar = async () => {
    if (!name.trim() || !selectedPlanId || !paymentMethod || !contact.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (!user || !id) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("students")
        .update({
          name,
          age: age ? parseInt(age) : null,
          plan_name: selectedPlan?.type || null,
          plan_value: selectedPlan?.value || null,
          payment_method: paymentMethod,
          contact,
          status,
          payment_status: isPaid ? "Pago" : "Não Pago",
        })
        .eq("id", id);

      if (error) throw error;

      // Se mudou de não pago para pago, adiciona entrada financeira
      if (isPaid && !originalIsPaid && selectedPlan) {
        const savedTransactions = localStorage.getItem("transactions");
        const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
        
        const newTransaction = {
          id: Date.now(),
          date: new Date().toLocaleDateString("pt-BR"),
          description: `Pagamento - ${name} (${selectedPlan.type})`,
          value: selectedPlan.value,
          type: "entrada",
        };

        transactions.unshift(newTransaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));
      }

      toast({
        title: "Sucesso",
        description: isPaid && !originalIsPaid 
          ? "Alterações salvas e pagamento registrado" 
          : "Alterações salvas com sucesso",
      });

      navigate("/students");
    } catch (error: any) {
      console.error("Erro ao atualizar aluno:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar aluno",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async () => {
    if (!id) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Aluno excluído com sucesso",
      });

      navigate("/students");
    } catch (error: any) {
      console.error("Erro ao excluir aluno:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir aluno",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Editar cadastro</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-foreground">Nome:</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="age" className="text-foreground">Idade:</Label>
            <Input
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              type="number"
              className="mt-1"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="plan" className="text-foreground">Plano:</Label>
            <Select value={selectedPlanId} onValueChange={setSelectedPlanId} disabled={loading}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                {plans.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Nenhum plano cadastrado
                  </SelectItem>
                ) : (
                  plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id.toString()}>
                      {plan.type} - R$ {plan.value.toFixed(2).replace(".", ",")}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="paymentMethod" className="text-foreground">Forma de Pagamento:</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={loading}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="contact" className="text-foreground">Contato (WhatsApp):</Label>
            <Input
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="5511999999999"
              className="mt-1"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="status" className="text-foreground">Status do Aluno:</Label>
            <Select value={status} onValueChange={setStatus} disabled={loading}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
            <div className="space-y-1">
              <Label htmlFor="isPaid" className="text-foreground font-medium">
                Status do Pagamento
              </Label>
              <p className="text-sm text-muted-foreground">
                {isPaid ? "Pago" : "Não Pago"}
                {isPaid && !originalIsPaid && selectedPlan && (
                  <span className="text-accent ml-2">
                    (R$ {selectedPlan.value.toFixed(2).replace(".", ",")} será adicionado às entradas)
                  </span>
                )}
              </p>
            </div>
            <Switch
              id="isPaid"
              checked={isPaid}
              onCheckedChange={setIsPaid}
              disabled={loading}
            />
          </div>

          <Button 
            size="lg" 
            className="w-full"
            onClick={handleSalvar}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>

          <Button 
            size="lg" 
            variant="destructive"
            className="w-full"
            onClick={() => setShowDeleteDialog(true)}
            disabled={loading}
          >
            Excluir
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExcluir}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
};

export default EditStudent;
