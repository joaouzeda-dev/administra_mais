import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Pencil, DollarSign, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useWhatsAppMessage } from "@/hooks/useWhatsAppMessage";

interface Student {
  id: string;
  name: string;
  age: number | null;
  plan_name: string | null;
  contact: string;
  status: string;
  payment_status: string;
}

interface BusinessSettings {
  business_name: string;
}

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const { sendPaymentReminder } = useWhatsAppMessage();

  useEffect(() => {
    fetchStudents();
    fetchBusinessSettings();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      // Fallback to localStorage for backwards compatibility
      const savedStudents = localStorage.getItem("students");
      if (savedStudents) {
        const localStudents = JSON.parse(savedStudents);
        setStudents(localStudents.map((s: any) => ({
          ...s,
          id: String(s.id),
          plan_name: s.plan,
          payment_status: s.paymentStatus || "Não Pago"
        })));
      }
    }
  };

  const fetchBusinessSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("business_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setBusinessSettings(data);
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
    }
  };

  const handleSendReminder = async (student: Student) => {
    if (student.payment_status === "Pago") {
      toast({
        title: "Pagamento em dia",
        description: "Este aluno já está com o pagamento em dia.",
      });
      return;
    }

    if (!businessSettings?.business_name) {
      toast({
        title: "Configuração necessária",
        description: "Configure o nome da academia em Configurações > Dados do Negócio.",
        variant: "destructive",
      });
      navigate("/settings/business");
      return;
    }

    try {
      await sendPaymentReminder(student, businessSettings);
      toast({
        title: "WhatsApp aberto",
        description: "A mensagem foi preparada no WhatsApp.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Alunos</h1>
          <p className="text-primary-foreground/80 text-sm">Gerencie seus alunos</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar aluno..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button size="lg" className="w-full" onClick={() => navigate("/students/new")}>
            <UserPlus className="mr-2 h-5 w-5" />
            Novo aluno
          </Button>
          <Button size="lg" variant="outline" className="w-full" onClick={() => navigate("/students/payment")}>
            <DollarSign className="mr-2 h-5 w-5" />
            Registrar pagamento
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de alunos</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {searchTerm ? "Nenhum aluno encontrado" : "Nenhum aluno cadastrado ainda"}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{student.name}</h3>
                        {student.payment_status === "Não Pago" && (
                          <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                            Pendente
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 space-y-1">
                        <p>Plano: {student.plan_name || "Não definido"}</p>
                        <p>Status: {student.status}</p>
                        <p>Contato: {student.contact}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {student.payment_status === "Não Pago" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleSendReminder(student)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          title="Enviar lembrete via WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => navigate(`/students/edit/${student.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Students;
