import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useState, useEffect } from "react";

interface Transaction {
  id: number;
  date: string;
  description: string;
  value: number;
  type: "entrada" | "saida";
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Filter transactions for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter((t) => {
    const [day, month, year] = t.date.split("/").map(Number);
    return month - 1 === currentMonth && year === currentYear;
  });

  const revenue = monthlyTransactions
    .filter((t) => t.type === "entrada")
    .reduce((acc, t) => acc + t.value, 0);

  const expenses = monthlyTransactions
    .filter((t) => t.type === "saida")
    .reduce((acc, t) => acc + t.value, 0);

  const balance = revenue - expenses;
  const total = revenue + expenses;
  const revenuePercentage = total > 0 ? Math.round((revenue / total) * 100) : 0;
  const expensePercentage = total > 0 ? Math.round((expenses / total) * 100) : 0;

  const data = [
    { name: "Receitas", value: revenuePercentage, amount: revenue },
    { name: "Despesas", value: expensePercentage, amount: expenses },
  ];

  const COLORS = ["hsl(var(--success))", "hsl(var(--destructive))"];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-primary-foreground/80 text-sm">Visão geral do seu negócio</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
        {/* Balance Card */}
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-muted-foreground font-medium">
              Saldo do mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-4xl font-bold ${balance >= 0 ? "text-success" : "text-destructive"}`}>
                  R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        {/* Revenue & Expenses Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-success/30 bg-success/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Receitas do mês
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-success">
                R$ {revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {revenuePercentage}% do total
              </p>
            </CardContent>
          </Card>

          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Despesas do mês
                </CardTitle>
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">
                R$ {expenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {expensePercentage}% do total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Receitas e Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {total > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `R$ ${props.payload.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                        props.payload.name
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Nenhum lançamento neste mês
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button size="lg" className="w-full" onClick={() => window.location.href = '/finances'}>
            <DollarSign className="mr-2 h-5 w-5" />
            Novos lançamentos
          </Button>
          
          <Button size="lg" className="w-full" onClick={() => window.location.href = '/students/new'}>
            <Users className="mr-2 h-5 w-5" />
            Cadastrar aluno
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
