import { supabase } from "@/integrations/supabase/client";

interface ConsultationEmailData {
  to: string;
  concern_type?: string;
  skin_type?: string;
  sensitivity_level?: string;
  ai_summary?: string;
  customer_name?: string;
  regimen?: Array<{
    title?: string;
    brand?: string;
    price?: number;
    step?: string;
  }>;
}

export async function sendConsultationSummaryEmail(data: ConsultationEmailData) {
  const { to, ...templateData } = data;

  const { data: result, error } = await supabase.functions.invoke(
    "send-transactional-email",
    {
      body: {
        template_name: "consultation-summary",
        to,
        data: templateData,
      },
    }
  );

  if (error) throw error;
  return result;
}
