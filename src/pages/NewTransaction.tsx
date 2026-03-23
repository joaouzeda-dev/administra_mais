import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const transactionSchema = z.object({
  description: z.string()
    .trim()
    .nonempty({ message: "A descrição não pode estar vazia" }),
  value: z.string()
    .trim()
    .nonempty({ message: "O valor não pode estar vazio" })
    .refine((val) => !isNaN(Number(val.replace(",", "."))), {
      message: "Digite um valor válido"
    })
    .refine((val) => Number(val.replace(",", ".")) > 0, {
      message: "O valor deve ser maior que zero"
    })
});

const NewTransaction = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialType = searchParams.get("type") === "saida" ? "saida" : "entrada";
  
  const [transactionType, setTransactionType] = useState<"entrada" | "saida">(initialType);
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");

  const handleSave = () => {
    try {
      transactionSchema.parse({ description, value });
      
      const numericValue = Number(value.replace(",", "."));
      
      // Get existing transactions from localStorage
      const existingTransactions = JSON.parse(localStorage.getItem("transactions") || "[]");
      
      // Create new transaction
      const newTransaction = {
        id: Date.now(),
        date: new Date().toLocaleDateString("pt-BR"),
        description: description.trim(),
        value: numericValue,
        type: transactionType
      };
      
      // Add to beginning of array (newest first)
      existingTransactions.unshift(newTransaction);
      
      // Save back to localStorage
      localStorage.setItem("transactions", JSON.stringify(existingTransactions));
      
      toast.success(
        `Lançamento registrado com sucesso!`,
        {
          description: `${transactionType === "entrada" ? "Entrada" : "Saída"} de R$ ${numericValue.toFixed(2).replace(".", ",")}`
        }
      );
      
      // Navigate back to finances
      navigate("/finances");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Erro", {
          description: error.errors[0].message
        });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Finanças</h1>
          <p className="text-primary-foreground/80 text-sm">Novo lançamento</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            size="lg"
            variant={transactionType === "entrada" ? "default" : "outline"}
            className={`h-16 ${
              transactionType === "entrada" 
                ? "bg-success hover:bg-success/90 text-success-foreground" 
                : ""
            }`}
            onClick={() => setTransactionType("entrada")}
          >
            Entrada
          </Button>
          <Button
            size="lg"
            variant={transactionType === "saida" ? "destructive" : "outline"}
            className="h-16"
            onClick={() => setTransactionType("saida")}
          >
            Saída
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">
              Descrição:
            </Label>
            <Input
              id="description"
              type="text"
              placeholder="Ex: Mensalidade, Aluguel, Salário..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-lg h-14"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value" className="text-base">
              Digite o valor:
            </Label>
            <Input
              id="value"
              type="text"
              placeholder="0,00"
              value={value}
              onChange={(e) => {
                const input = e.target.value;
                // Allow only numbers, comma and dot
                if (/^[\d,\.]*$/.test(input)) {
                  setValue(input);
                }
              }}
              className="text-lg h-14"
            />
          </div>

          <Button 
            size="lg" 
            className="w-full h-14" 
            onClick={handleSave}
          >
            Salvar
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default NewTransaction;
