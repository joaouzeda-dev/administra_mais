import { NavLink } from "react-router-dom";
import { Home, Users, DollarSign, FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const navItems = [
    { to: "/dashboard", icon: Home, label: "Home" },
    { to: "/students", icon: Users, label: "Alunos" },
    { to: "/finances", icon: DollarSign, label: "Finanças" },
    { to: "/reports", icon: FileText, label: "Relatórios" },
    { to: "/settings", icon: Settings, label: "Config." },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px]",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
                  <span className="text-xs font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
