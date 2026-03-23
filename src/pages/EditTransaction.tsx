import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface Transaction {
  id: number;
  description: string;
  value: number;
  type: "entrada" | "saida";
  selected: boolean;
}

const EditTransaction = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      const parsed = JSON.parse(savedTransactions);
      setTransactions(parsed.map((t: any) => ({ ...t, selected: false })));
    }
  }, []);

  const toggleTransaction = (id: number) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, selected: !t.selected } : t
    ));
  };

  const handleEdit = () => {
    const selected = transactions.filter(t => t.selected);
    
    if (selected.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione ao menos uma fatura para editar",
        variant: "destructive",
      });
      return;
    }

    if (selected.length > 1) {
      toast({
        title: "Atenção",
        description: "Selecione apenas uma fatura por vez",
        variant: "destructive",
      });
      return;
    }

    // Navigate to edit the selected transaction
    navigate(`/finances/new?edit=${selected[0].id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Finanças</h1>
          <p className="text-primary-foreground/80 text-sm">Editar</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
        <div>
          <h2 className="text-lg font-bold mb-4 text-foreground">Fatura:</h2>
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <label 
                  htmlFor={`transaction-${transaction.id}`}
                  className={`flex-1 cursor-pointer ${
                    transaction.type === "entrada" ? "text-success" : "text-destructive"
                  }`}
                >
                  {index + 1}. {transaction.description} R${transaction.value.toFixed(2).replace(".", ",")}
                </label>
                <Checkbox
                  id={`transaction-${transaction.id}`}
                  checked={transaction.selected}
                  onCheckedChange={() => toggleTransaction(transaction.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8">
          <p className="text-center text-foreground mb-6">
            Selecione qual fatura deseja alterar
          </p>
          <Button 
            size="lg" 
            className="w-full"
            onClick={handleEdit}
          >
            Editar
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default EditTransaction;
