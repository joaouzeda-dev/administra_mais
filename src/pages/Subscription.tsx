import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Check, Crown, Zap, Building2 } from "lucide-react";

interface Plan {
  id: number;
  name: string;
  maxStudents: string;
  monthlyPrice: number;
  semesterPrice: number;
  annualPrice: number;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

type BillingPeriod = "monthly" | "semester" | "annual";

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  const plans: Plan[] = [
    {
      id: 1,
      name: "Básico",
      maxStudents: "50",
      monthlyPrice: 29.90,
      semesterPrice: 152.49,
      annualPrice: 287.04,
      icon: <Zap className="h-6 w-6" />,
      features: [
        "Até 50 alunos",
        "Controle financeiro",
        "Relatórios básicos",
        "Suporte por email",
      ],
    },
    {
      id: 2,
      name: "Profissional",
      maxStudents: "200",
      monthlyPrice: 49.90,
      semesterPrice: 254.49,
      annualPrice: 479.04,
      icon: <Crown className="h-6 w-6" />,
      popular: true,
      features: [
        "Até 200 alunos",
        "Controle financeiro avançado",
        "Relatórios completos",
        "Backup automático",
        "Suporte prioritário",
      ],
    },
    {
      id: 3,
      name: "Empresarial",
      maxStudents: "∞",
      monthlyPrice: 129.90,
      semesterPrice: 662.49,
      annualPrice: 1247.04,
      icon: <Building2 className="h-6 w-6" />,
      features: [
        "Alunos ilimitados",
        "Múltiplas filiais",
        "Todos os recursos",
        "API personalizada",
        "Suporte 24/7",
        "Gerente dedicado",
      ],
    },
  ];

  const getPrice = (plan: Plan) => {
    switch (billingPeriod) {
      case "semester":
        return plan.semesterPrice;
      case "annual":
        return plan.annualPrice;
      default:
        return plan.monthlyPrice;
    }
  };

  const getPeriodLabel = () => {
    switch (billingPeriod) {
      case "semester":
        return "/semestre";
      case "annual":
        return "/ano";
      default:
        return "/mês";
    }
  };

  const getDiscount = () => {
    switch (billingPeriod) {
      case "semester":
        return "15% OFF";
      case "annual":
        return "20% OFF";
      default:
        return null;
    }
  };

  const detectPlatform = (): "ios" | "android" | "web" => {
    const userAgent = navigator.userAgent || navigator.vendor;
    
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return "ios";
    }
    if (/android/i.test(userAgent)) {
      return "android";
    }
    return "web";
  };

  const handleSubscribe = () => {
    if (selectedPlan === null) {
      toast({
        title: "Atenção",
        description: "Selecione um plano para continuar",
        variant: "destructive",
      });
      return;
    }

    const platform = detectPlatform();
    const selectedPlanData = plans.find(p => p.id === selectedPlan);
    
    toast({
      title: "Redirecionando...",
      description: `Você será redirecionado para a loja de aplicativos`,
    });

    // Simulate store redirect based on platform
    setTimeout(() => {
      if (platform === "ios") {
        // Replace with your actual App Store subscription link
        window.location.href = "https://apps.apple.com/app/id000000000";
      } else if (platform === "android") {
        // Replace with your actual Google Play subscription link
        window.location.href = "https://play.google.com/store/apps/details?id=app.lovable.1846de1fc2c34c2cac09930b3459d97f";
      } else {
        // For web, show info about downloading the app
        toast({
          title: "Baixe o aplicativo",
          description: "Para assinar, baixe nosso app na App Store ou Google Play",
        });
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Assinatura</h1>
          <p className="text-primary-foreground/80 text-sm">Escolha o plano ideal para você</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
        {/* Billing Period Selector */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center gap-2">
              <Button
                variant={billingPeriod === "monthly" ? "default" : "outline"}
                size="sm"
                onClick={() => setBillingPeriod("monthly")}
              >
                Mensal
              </Button>
              <Button
                variant={billingPeriod === "semester" ? "default" : "outline"}
                size="sm"
                onClick={() => setBillingPeriod("semester")}
                className="relative"
              >
                Semestral
                {billingPeriod !== "semester" && (
                  <span className="absolute -top-2 -right-2 bg-success text-success-foreground text-[10px] px-1.5 py-0.5 rounded-full">
                    15%
                  </span>
                )}
              </Button>
              <Button
                variant={billingPeriod === "annual" ? "default" : "outline"}
                size="sm"
                onClick={() => setBillingPeriod("annual")}
                className="relative"
              >
                Anual
                {billingPeriod !== "annual" && (
                  <span className="absolute -top-2 -right-2 bg-success text-success-foreground text-[10px] px-1.5 py-0.5 rounded-full">
                    20%
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`cursor-pointer transition-all relative ${
                selectedPlan === plan.id
                  ? "border-primary ring-2 ring-primary shadow-lg"
                  : "border-border hover:border-primary/50"
              } ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                  Mais Popular
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div className={`mx-auto p-3 rounded-full ${
                  selectedPlan === plan.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-xl mt-3">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">Até {plan.maxStudents} alunos</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">
                    R$ {getPrice(plan).toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-muted-foreground text-sm">{getPeriodLabel()}</span>
                  {getDiscount() && (
                    <span className="ml-2 bg-success/20 text-success text-xs px-2 py-0.5 rounded-full">
                      {getDiscount()}
                    </span>
                  )}
                </div>
                <ul className="space-y-2 text-sm text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subscribe Button */}
        <Button 
          size="lg" 
          className="w-full"
          onClick={handleSubscribe}
          disabled={selectedPlan === null}
        >
          {selectedPlan 
            ? `Assinar ${plans.find(p => p.id === selectedPlan)?.name}` 
            : "Selecione um plano"
          }
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Você será redirecionado para a loja de aplicativos do seu dispositivo para concluir a assinatura.
          Cancele a qualquer momento.
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Subscription;
