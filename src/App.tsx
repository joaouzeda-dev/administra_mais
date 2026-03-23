import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import NewStudent from "./pages/NewStudent";
import EditStudent from "./pages/EditStudent";
import RegisterPayment from "./pages/RegisterPayment";
import Finances from "./pages/Finances";
import NewTransaction from "./pages/NewTransaction";
import PlansManagement from "./pages/PlansManagement";
import EditTransaction from "./pages/EditTransaction";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotificationSettings from "./pages/NotificationSettings";
import ThemeSettings from "./pages/ThemeSettings";
import Subscription from "./pages/Subscription";
import Backup from "./pages/Backup";
import Logout from "./pages/Logout";
import FAQ from "./pages/FAQ";
import Chatbot from "./pages/Chatbot";
import BusinessSettings from "./pages/BusinessSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
            <Route path="/students/new" element={<ProtectedRoute><NewStudent /></ProtectedRoute>} />
            <Route path="/students/edit/:id" element={<ProtectedRoute><EditStudent /></ProtectedRoute>} />
            <Route path="/students/payment" element={<ProtectedRoute><RegisterPayment /></ProtectedRoute>} />
            <Route path="/finances" element={<ProtectedRoute><Finances /></ProtectedRoute>} />
            <Route path="/finances/new" element={<ProtectedRoute><NewTransaction /></ProtectedRoute>} />
            <Route path="/finances/plans" element={<ProtectedRoute><PlansManagement /></ProtectedRoute>} />
            <Route path="/finances/edit" element={<ProtectedRoute><EditTransaction /></ProtectedRoute>} />
            <Route path="/finances/edit/:id" element={<ProtectedRoute><NewTransaction /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/settings/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings/notifications" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
            <Route path="/settings/theme" element={<ProtectedRoute><ThemeSettings /></ProtectedRoute>} />
            <Route path="/settings/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
            <Route path="/settings/backup" element={<ProtectedRoute><Backup /></ProtectedRoute>} />
            <Route path="/settings/logout" element={<Logout />} />
            <Route path="/settings/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
            <Route path="/settings/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
            <Route path="/settings/business" element={<ProtectedRoute><BusinessSettings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
