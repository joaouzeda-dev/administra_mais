import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Users, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Student {
  id: string;
  name: string;
  age: number | null;
  plan_name: string | null;
  plan_value: number | null;
  payment_method: string | null;
  contact: string;
  status: string;
  payment_status: string;
}

const RegisterPayment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchUnpaidStudents();
  }, [user]);

  const fetchUnpaidStudents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", user.id)
        .eq("payment_status", "Não Pago")
        .order("name");

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    } finally {
      setFetching(false);
    }
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectedStudents = students.filter(s => selectedStudentIds.includes(s.id));
  
  const totalValue = selectedStudents.reduce((acc, student) => {
    return acc + (student.plan_value || 0);
  }, 0);

  const handleConfirmPayment = async () => {
    if (selectedStudentIds.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um aluno",
        variant: "destructive",
      });
      return;
    }

    // Verifica se todos os alunos têm plano e forma de pagamento
    const invalidStudents = selectedStudents.filter(s => !s.plan_value || !s.payment_method);
    if (invalidStudents.length > 0) {
      toast({
        title: "Erro",
        description: `${invalidStudents.map(s => s.name).join(", ")} não possui plano ou forma de pagamento cadastrada`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Update students as paid
      const { error } = await supabase
        .from("students")
        .update({ payment_status: "Pago" })
        .in("id", selectedStudentIds);

      if (error) throw error;

      // Adiciona entradas financeiras localmente
      const savedTransactions = localStorage.getItem("transactions");
      const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
      
      selectedStudents.forEach((student, index) => {
        if (student.plan_value) {
          const newTransaction = {
            id: Date.now() + index,
            date: new Date().toLocaleDateString("pt-BR"),
            description: `Pagamento - ${student.name} (${student.plan_name})`,
            value: student.plan_value,
            type: "entrada",
          };
          transactions.unshift(newTransaction);
        }
      });

      localStorage.setItem("transactions", JSON.stringify(transactions));

      toast({
        title: "Pagamentos registrados!",
        description: `${selectedStudentIds.length} pagamento(s) - R$ ${totalValue.toFixed(2).replace(".", ",")} adicionado às entradas`,
      });

      navigate("/students");
    } catch (error: any) {
      console.error("Erro ao registrar pagamentos:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao registrar pagamentos",
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
          <h1 className="text-2xl font-bold mb-1">Registrar Pagamento</h1>
          <p className="text-primary-foreground/80 text-sm">Confirme o pagamento dos alunos</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Selecionar Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum aluno com pagamento pendente
              </p>
            ) : (
              <div className="space-y-3">
                {students.map((student) => {
                  const isSelected = selectedStudentIds.includes(student.id);
                  
                  return (
                    <div
                      key={student.id}
                      onClick={() => toggleStudent(student.id)}
                      className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        isSelected 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleStudent(student.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <p className="font-semibold text-foreground">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Plano: {student.plan_name} - {student.plan_value 
                            ? `R$ ${student.plan_value.toFixed(2).replace(".", ",")}` 
                            : "Valor não encontrado"
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Forma de pagamento: {student.payment_method || "Não cadastrada"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedStudentIds.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total selecionado</p>
                  <p className="text-lg font-bold text-foreground">
                    {selectedStudentIds.length} aluno(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Valor total</p>
                  <p className="text-2xl font-bold text-accent">
                    R$ {totalValue.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Button 
          size="lg" 
          className="w-full"
          onClick={handleConfirmPayment}
          disabled={selectedStudentIds.length === 0 || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Confirmar Pagamento ({selectedStudentIds.length})
            </>
          )}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default RegisterPayment;
