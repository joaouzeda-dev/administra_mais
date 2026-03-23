import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface Transaction {
  id: number;
  date: string;
  description: string;
  value: number;
  type: "entrada" | "saida";
}

interface Student {
  id: number;
  name: string;
  age: number;
  plan: string;
  contact: string;
  status: string;
  createdAt: string;
}

const Reports = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }

    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  const generateMonthlyReport = () => {
    if (transactions.length === 0 && students.length === 0) {
      toast({
        title: "Aviso",
        description: "Não há dados para gerar o relatório.",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString("pt-BR");
    
    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Administra+", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.text("Relatório Mensal Completo", 105, 30, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Gerado em: ${currentDate}`, 105, 38, { align: "center" });
    
    // Financial Summary
    const entradas = transactions.filter(t => t.type === "entrada");
    const saidas = transactions.filter(t => t.type === "saida");
    const totalEntradas = entradas.reduce((acc, t) => acc + t.value, 0);
    const totalSaidas = saidas.reduce((acc, t) => acc + t.value, 0);
    const saldo = totalEntradas - totalSaidas;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("RESUMO FINANCEIRO", 20, 55);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Total de Entradas: R$ ${totalEntradas.toFixed(2).replace(".", ",")}`, 20, 65);
    doc.text(`Total de Saídas: R$ ${totalSaidas.toFixed(2).replace(".", ",")}`, 20, 72);
    doc.text(`Saldo: R$ ${saldo.toFixed(2).replace(".", ",")}`, 20, 79);
    
    // Transactions table
    let yPosition = 95;
    
    if (transactions.length > 0) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Extrato de Transações", 20, yPosition);
      
      yPosition += 5;
      doc.setFontSize(10);
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPosition, 170, 8, "F");
      doc.text("Data", 25, yPosition + 6);
      doc.text("Descrição", 55, yPosition + 6);
      doc.text("Tipo", 120, yPosition + 6);
      doc.text("Valor", 155, yPosition + 6);
      
      doc.setFont("helvetica", "normal");
      yPosition += 14;
      
      transactions.forEach((transaction) => {
        if (yPosition > 180) {
          return;
        }
        
        doc.text(transaction.date, 25, yPosition);
        doc.text(transaction.description.substring(0, 30), 55, yPosition);
        doc.text(transaction.type === "entrada" ? "Entrada" : "Saída", 120, yPosition);
        doc.text(`R$ ${transaction.value.toFixed(2).replace(".", ",")}`, 155, yPosition);
        
        yPosition += 8;
      });
    }
    
    // Students Summary
    yPosition = Math.max(yPosition + 10, 195);
    
    const ativos = students.filter(s => s.status.toLowerCase() === "ativo").length;
    const inativos = students.filter(s => s.status.toLowerCase() === "inativo").length;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("RESUMO DE ALUNOS", 20, yPosition);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Total de Alunos: ${students.length}`, 20, yPosition + 10);
    doc.text(`Alunos Ativos: ${ativos}`, 20, yPosition + 17);
    doc.text(`Alunos Inativos: ${inativos}`, 20, yPosition + 24);
    
    // Students table
    if (students.length > 0) {
      yPosition += 35;
      
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Lista de Alunos", 20, yPosition);
      
      yPosition += 5;
      doc.setFontSize(10);
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPosition, 170, 8, "F");
      doc.text("Nome", 25, yPosition + 6);
      doc.text("Plano", 85, yPosition + 6);
      doc.text("Contato", 120, yPosition + 6);
      doc.text("Status", 165, yPosition + 6);
      
      doc.setFont("helvetica", "normal");
      yPosition += 14;
      
      students.forEach((student) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(student.name.substring(0, 25), 25, yPosition);
        doc.text(student.plan.substring(0, 15), 85, yPosition);
        doc.text(student.contact.substring(0, 20), 120, yPosition);
        doc.text(student.status, 165, yPosition);
        
        yPosition += 8;
      });
    }
    
    doc.save("relatorio-mensal-completo.pdf");
    
    toast({
      title: "Sucesso",
      description: "Relatório mensal completo gerado com sucesso!",
    });
  };

  const generateStudentsReport = () => {
    if (students.length === 0) {
      toast({
        title: "Aviso",
        description: "Não há alunos cadastrados para gerar o relatório.",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString("pt-BR");
    
    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Administra+", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.text("Relatório de Alunos", 105, 30, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Gerado em: ${currentDate}`, 105, 38, { align: "center" });
    
    // Summary
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Resumo", 20, 55);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Total de Alunos: ${students.length}`, 20, 65);
    
    const ativos = students.filter(s => s.status.toLowerCase() === "ativo").length;
    const inativos = students.filter(s => s.status.toLowerCase() === "inativo").length;
    doc.text(`Alunos Ativos: ${ativos}`, 20, 72);
    doc.text(`Alunos Inativos: ${inativos}`, 20, 79);
    
    // Table header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Lista de Alunos", 20, 95);
    
    doc.setFontSize(10);
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 100, 170, 8, "F");
    doc.text("Nome", 25, 106);
    doc.text("Plano", 85, 106);
    doc.text("Contato", 120, 106);
    doc.text("Status", 165, 106);
    
    // Table rows
    doc.setFont("helvetica", "normal");
    let yPosition = 114;
    
    students.forEach((student) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(student.name.substring(0, 25), 25, yPosition);
      doc.text(student.plan.substring(0, 15), 85, yPosition);
      doc.text(student.contact.substring(0, 20), 120, yPosition);
      doc.text(student.status, 165, yPosition);
      
      yPosition += 8;
    });
    
    doc.save("relatorio-alunos.pdf");
    
    toast({
      title: "Sucesso",
      description: "Relatório de alunos gerado com sucesso!",
    });
  };

  const generateFinancialReport = () => {
    if (transactions.length === 0) {
      toast({
        title: "Aviso",
        description: "Não há transações para gerar o relatório.",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString("pt-BR");
    
    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Administra+", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.text("Relatório Financeiro Detalhado", 105, 30, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Gerado em: ${currentDate}`, 105, 38, { align: "center" });
    
    // Entradas
    const entradas = transactions.filter(t => t.type === "entrada");
    const totalEntradas = entradas.reduce((acc, t) => acc + t.value, 0);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 139, 34);
    doc.text("ENTRADAS", 20, 55);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(220, 255, 220);
    doc.rect(20, 60, 170, 8, "F");
    doc.text("Data", 25, 66);
    doc.text("Descrição", 55, 66);
    doc.text("Valor", 155, 66);
    
    doc.setFont("helvetica", "normal");
    let yPosition = 74;
    
    entradas.forEach((transaction) => {
      if (yPosition > 140) {
        yPosition = 145;
      }
      doc.text(transaction.date, 25, yPosition);
      doc.text(transaction.description.substring(0, 40), 55, yPosition);
      doc.text(`R$ ${transaction.value.toFixed(2).replace(".", ",")}`, 155, yPosition);
      yPosition += 7;
    });
    
    doc.setFont("helvetica", "bold");
    doc.text(`Total Entradas: R$ ${totalEntradas.toFixed(2).replace(".", ",")}`, 20, Math.min(yPosition + 5, 140));
    
    // Saídas
    const saidas = transactions.filter(t => t.type === "saida");
    const totalSaidas = saidas.reduce((acc, t) => acc + t.value, 0);
    
    doc.setFontSize(14);
    doc.setTextColor(220, 20, 60);
    doc.text("SAÍDAS", 20, 155);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(255, 220, 220);
    doc.rect(20, 160, 170, 8, "F");
    doc.text("Data", 25, 166);
    doc.text("Descrição", 55, 166);
    doc.text("Valor", 155, 166);
    
    doc.setFont("helvetica", "normal");
    yPosition = 174;
    
    saidas.forEach((transaction) => {
      if (yPosition > 250) {
        return;
      }
      doc.text(transaction.date, 25, yPosition);
      doc.text(transaction.description.substring(0, 40), 55, yPosition);
      doc.text(`R$ ${transaction.value.toFixed(2).replace(".", ",")}`, 155, yPosition);
      yPosition += 7;
    });
    
    doc.setFont("helvetica", "bold");
    doc.text(`Total Saídas: R$ ${totalSaidas.toFixed(2).replace(".", ",")}`, 20, Math.min(yPosition + 5, 260));
    
    // Saldo final
    const saldo = totalEntradas - totalSaidas;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`SALDO FINAL: R$ ${saldo.toFixed(2).replace(".", ",")}`, 20, 280);
    
    doc.save("relatorio-financeiro.pdf");
    
    toast({
      title: "Sucesso",
      description: "Relatório financeiro gerado com sucesso!",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Relatórios</h1>
          <p className="text-primary-foreground/80 text-sm">Análises e exportações</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Relatórios disponíveis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={generateMonthlyReport}
            >
              <span className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Relatório mensal
              </span>
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={generateStudentsReport}
            >
              <span className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Relatório de alunos
              </span>
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={generateFinancialReport}
            >
              <span className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Relatório financeiro
              </span>
              <Download className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Os relatórios serão exportados em formato PDF
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Reports;
