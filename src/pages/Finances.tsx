import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface Transaction {
  id: number;
  date: string;
  description: string;
  value: number;
  type: "entrada" | "saida";
}

interface Plan {
  id: number;
  type: string;
  value: number;
}

const Finances = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const savedPlans = localStorage.getItem("plans");
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }

    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === "entrada" 
      ? acc + transaction.value 
      : acc - transaction.value;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Finanças</h1>
          <p className="text-primary-foreground/80 text-sm">Controle financeiro completo</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            size="lg" 
            variant="default" 
            className="h-24 flex-col gap-2 bg-success hover:bg-success/90 text-success-foreground"
            onClick={() => navigate("/finances/new?type=entrada")}
          >
            <TrendingUp className="h-6 w-6" />
            <span>Nova Entrada</span>
          </Button>
          <Button 
            size="lg" 
            variant="destructive" 
            className="h-24 flex-col gap-2"
            onClick={() => navigate("/finances/new?type=saida")}
          >
            <TrendingDown className="h-6 w-6" />
            <span>Nova Saída</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Extrato</span>
              <span className={balance >= 0 ? "text-success" : "text-destructive"}>
                R$ {balance.toFixed(2).replace(".", ",")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum lançamento registrado
              </p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    onClick={() => navigate(`/finances/edit/${transaction.id}`)}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                    <p className={`font-bold ${transaction.type === "entrada" ? "text-success" : "text-destructive"}`}>
                      {transaction.type === "entrada" ? "+" : "-"}R$ {transaction.value.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planos cadastrados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plans.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhum plano cadastrado
              </p>
            ) : (
              <div className="space-y-2">
                {plans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <span className="font-medium text-foreground">
                      {index + 1}. {plan.type}
                    </span>
                    <span className="font-bold text-primary">
                      R$ {plan.value.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/finances/plans")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Gerenciar planos
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Finances;
