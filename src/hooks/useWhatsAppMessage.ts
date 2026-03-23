import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Student {
  id: string;
  name: string;
  contact: string;
  plan_name: string | null;
  payment_status: string;
}

interface BusinessSettings {
  business_name: string;
}

export const useWhatsAppMessage = () => {
  const generateMessage = useCallback(
    (studentName: string, planName: string, businessName: string) => {
      return `Olá, ${studentName}! 👋

Este é um lembrete rápido: O vencimento da sua mensalidade referente ao plano ${planName} é hoje.

Para continuar treinando, mantenha o pagamento em dia!

Qualquer dúvida, entre em contato com a equipe de ${businessName}.

Atenciosamente, ${businessName}`;
    },
    []
  );

  const openWhatsApp = useCallback(
    (phoneNumber: string, message: string) => {
      // Clean phone number - remove non-numeric characters
      const cleanPhone = phoneNumber.replace(/\D/g, "");
      
      // Add Brazil country code if not present
      const formattedPhone = cleanPhone.startsWith("55")
        ? cleanPhone
        : `55${cleanPhone}`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, "_blank");
    },
    []
  );

  const sendPaymentReminder = useCallback(
    async (student: Student, businessSettings: BusinessSettings | null) => {
      if (!businessSettings?.business_name) {
        throw new Error("Nome do negócio não configurado");
      }

      if (!student.contact) {
        throw new Error("Aluno sem número de contato cadastrado");
      }

      if (!student.plan_name) {
        throw new Error("Aluno sem plano cadastrado");
      }

      const message = generateMessage(
        student.name,
        student.plan_name,
        businessSettings.business_name
      );

      openWhatsApp(student.contact, message);

      // Log the message sent
      try {
        await supabase.from("message_logs").insert({
          student_id: student.id,
          message_type: "payment_reminder",
          phone_number: student.contact,
          message_content: message,
          status: "sent",
        });
      } catch (error) {
        console.error("Erro ao registrar log de mensagem:", error);
      }

      return true;
    },
    [generateMessage, openWhatsApp]
  );

  return {
    generateMessage,
    openWhatsApp,
    sendPaymentReminder,
  };
};
