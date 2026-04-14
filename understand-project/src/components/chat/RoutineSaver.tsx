import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, Check, Loader2 } from "lucide-react";

interface RoutineSaverProps {
  products: Array<{ id: string; title: string; price: number }>;
  concern?: string;
}

export const RoutineSaver = ({ products, concern }: RoutineSaverProps) => {
  const { language } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsDone] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [email, setEmail] = useState("");

  const handleSaveToProfile = async () => {
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setShowLeadForm(true);
        setIsSaving(false);
        return;
      }

      // Save to concierge_profiles
      const { error } = await supabase
        .from("concierge_profiles")
        .upsert({
          user_id: session.user.id,
          skin_concern: concern || "General",
          recommended_routine: products,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

      if (error) throw error;

      setIsDone(true);
      toast.success(
        language === "ar" 
          ? "ØªÙ… Ø­ÙØ¸ Ø§Ù„Ø±ÙˆØªÙŠÙ† ÙÙŠ Ù…Ù„ÙÙƒ Ø§Ù„Ø´Ø®ØµÙŠ" 
          : "Routine saved to your profile"
      );
    } catch (error) {
      console.error("Save error:", error);
      toast.error(
        language === "ar" ? "ÙØ´Ù„ Ø§Ù„Ø­ÙØ¸" : "Failed to save routine"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLeadSubmit = async () => {
    if (!email.includes("@")) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.functions.invoke("capture-bot-lead", {
        body: {
          contact_email: email,
          concern: concern,
          recommended_product_ids: products.map(p => p.id),
          source: "routine_saver_ui"
        }
      });

      if (error) throw error;

      setIsDone(true);
      setShowLeadForm(false);
      toast.success(
        language === "ar"
          ? "ØªÙ… Ø§Ù„Ø­ÙØ¸. Ø³Ù†Ø±Ø³Ù„ Ù„Ùƒ Ø§Ù„Ø±Ø§Ø¨Ø·."
          : "Saved. We'll email you the regimen."
      );
    } catch (error) {
      toast.error("Error saving lead");
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaved) {
    return (
      <div className="flex items-center justify-center gap-2 py-2 text-green-600 font-medium text-sm animate-fade-in">
        <Check className="w-4 h-4" />
        {language === "ar" ? "ØªÙ… Ø§Ù„Ø­ÙØ¸" : "Saved"}
      </div>
    );
  }

  if (showLeadForm) {
    return (
      <div className="space-y-3 p-3 bg-asper-stone/30 rounded-lg border border-shiny-gold/20 animate-in fade-in slide-in-from-top-2">
        <p className="text-xs text-asper-ink font-body">
          {language === "ar" 
            ? "Ø£Ø¯Ø®Ù„ Ø¨Ø±ÙŠØ¯Ùƒ Ù„Ø­ÙØ¸ Ø§Ù„Ø±ÙˆØªÙŠÙ† ÙˆØ§Ù„ÙˆØµÙˆÙ„ Ø¥Ù„ÙŠÙ‡ Ù„Ø§Ø­Ù‚Ø§Ù‹" 
            : "Enter your email to save this routine for later access"}
        </p>
        <div className="flex gap-2">
          <Input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="h-9 text-xs"
          />
          <Button 
            size="sm" 
            onClick={handleLeadSubmit}
            disabled={isSaving}
            className="bg-burgundy text-white h-9"
          >
            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : (language === "ar" ? "Ø­ÙØ¸" : "Save")}
          </Button>
        </div>
        <button 
          onClick={() => setShowLeadForm(false)}
          className="text-[10px] text-muted-foreground hover:underline"
        >
          {language === "ar" ? "Ø¥Ù„ØºØ§Ø¡" : "Cancel"}
        </button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleSaveToProfile}
      disabled={isSaving}
      className="w-full mt-2 border-shiny-gold/40 text-burgundy hover:bg-shiny-gold/10 gap-2 h-10"
    >
      {isSaving ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <Save className="w-4 h-4" />
          {language === "ar" ? "Ø­ÙØ¸ Ø§Ù„Ø±ÙˆØªÙŠÙ† ÙÙŠ Ù…Ù„ÙÙŠ" : "Save Routine to Profile"}
        </>
      )}
    </Button>
  );
};

