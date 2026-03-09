import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  ArrowLeft,
  Save,
  User,
  Stethoscope,
  Sparkles,
  Smartphone,
  Shield,
  CreditCard,
  Droplets,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import asperLogo from "@/assets/asper-lotus-logo.png";
import AsperAccessCard from "@/components/AsperAccessCard";
import mirrorHero from "@/assets/protocol-mirror-hero.jpg";
import nexusHero from "@/assets/protocol-nexus-hero.jpg";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

/** Skin concern labels for the regimen display */
const CONCERN_LABELS: Record<string, { en: string; ar: string; icon: string }> = {
  Concern_Hydration: { en: "Hydration Protocol", ar: "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø§Ù„ØªØ±Ø·ÙŠØ¨", icon: "ðŸ’§" },
  Concern_Acne: { en: "Acne Protocol", ar: "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø­Ø¨ Ø§Ù„Ø´Ø¨Ø§Ø¨", icon: "ðŸŽ¯" },
  Concern_Aging: { en: "Anti-Aging Protocol", ar: "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ù…ÙƒØ§ÙØ­Ø© Ø§Ù„Ø´ÙŠØ®ÙˆØ®Ø©", icon: "âœ¨" },
  Concern_Sensitivity: { en: "Sensitivity Protocol", ar: "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø§Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ø­Ø³Ø§Ø³Ø©", icon: "ðŸ›¡ï¸" },
  Concern_Pigmentation: { en: "Pigmentation Protocol", ar: "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø§Ù„ØªØµØ¨ØºØ§Øª", icon: "ðŸŒŸ" },
  Concern_AntiAging: { en: "Anti-Aging Protocol", ar: "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ù…ÙƒØ§ÙØ­Ø© Ø§Ù„Ø´ÙŠØ®ÙˆØ®Ø©", icon: "âœ¨" },
  Concern_Dryness: { en: "Dryness Protocol", ar: "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø§Ù„Ø¬ÙØ§Ù", icon: "ðŸœï¸" },
  Concern_Redness: { en: "Redness Protocol", ar: "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø§Ù„Ø§Ø­Ù…Ø±Ø§Ø±", icon: "ðŸŒ¸" },
  Concern_Oiliness: { en: "Oil Control Protocol", ar: "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø§Ù„ØªØ­ÙƒÙ… Ø¨Ø§Ù„Ø²ÙŠÙˆØª", icon: "ðŸ’Ž" },
  Concern_Brightening: { en: "Brightening Protocol", ar: "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø§Ù„ØªÙØªÙŠØ­", icon: "â˜€ï¸" },
  Concern_SunProtection: { en: "Sun Shield Protocol", ar: "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø§Ù„Ø­Ù…Ø§ÙŠØ© Ù…Ù† Ø§Ù„Ø´Ù…Ø³", icon: "ðŸ›¡ï¸" },
  Concern_DarkCircles: { en: "Dark Circle Protocol", ar: "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø§Ù„Ù‡Ø§Ù„Ø§Øª Ø§Ù„Ø³ÙˆØ¯Ø§Ø¡", icon: "ðŸ‘ï¸" },
};

export default function Profile() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Concierge profile data
  const [skinConcern, setSkinConcern] = useState<string | null>(null);
  const [skinType, setSkinType] = useState<string | null>(null);
  const [routine, setRoutine] = useState<Record<string, unknown> | null>(null);
  const [consultationCount, setConsultationCount] = useState(0);
  const [ledgerEntries, setLedgerEntries] = useState<import("@/components/AsperAccessCard").LedgerEntry[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      // Profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, phone")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile) {
        setDisplayName(profile.display_name ?? "");
        setPhone(profile.phone ?? "");
      } else {
        setDisplayName(user.user_metadata?.full_name ?? "");
      }

      // Concierge profile
      const { data: concierge } = await supabase
        .from("concierge_profiles")
        .select("skin_concern, skin_type, recommended_routine")
        .eq("user_id", user.id)
        .maybeSingle();

      if (concierge) {
        setSkinConcern(concierge.skin_concern);
        setSkinType(concierge.skin_type);
        setRoutine(concierge.recommended_routine as Record<string, unknown>);
      }

      // Consultations â€” count + recent for ledger
      const { data: recentConsultations, count } = await supabase
        .from("consultations")
        .select("id, channel, regimen, created_at", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      setConsultationCount(count ?? 0);

      if (recentConsultations && recentConsultations.length > 0) {
        setLedgerEntries(
          recentConsultations.map((c) => {
            const regimen = c.regimen as Record<string, unknown> | null;
            const title = (regimen?.title as string) || (c.channel === "whatsapp" ? "WhatsApp Consultation" : "Clinical Consultation");
            const persona = (regimen?.persona as string) || (c.channel === "whatsapp" ? "ms_zain" : "dr_sami");
            return { persona, title, date: c.created_at };
          })
        );
      }

      setLoadingProfile(false);
    };

    fetchAll();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const initials = (displayName || user.user_metadata?.full_name || user.email || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          { user_id: user.id, display_name: displayName, phone, updated_at: new Date().toISOString() },
          { onConflict: "user_id" }
        );
      if (error) throw error;
      toast({ title: isArabic ? "ØªÙ… Ø§Ù„ØªØ­Ø¯ÙŠØ«" : "Profile updated", description: isArabic ? "ØªÙ… Ø­ÙØ¸ Ø§Ù„ØªØºÙŠÙŠØ±Ø§Øª" : "Your changes have been saved." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const concernLabel = skinConcern ? CONCERN_LABELS[skinConcern] : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* â•â•â• PROTOCOL 5: THE MIRROR â€” Hero â•â•â• */}
      <section className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
        <img
          src={mirrorHero}
          alt="Asper Clinical Access Card â€” The Mirror"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: LUXURY_EASE }}
          >
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-polished-gold mb-3 block">
              {isArabic ? "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ù¥ â€” Ø§Ù„Ù…Ø±Ø¢Ø©" : "Protocol 5 â€” The Mirror"}
            </span>
            <h1 className="font-heading text-3xl lg:text-5xl text-foreground font-bold mb-3">
              {isArabic ? "Ù…Ø±Ø­Ø¨Ø§Ù‹ØŒ " : "Welcome, "}
              <span className="text-polished-gold">{displayName || user.user_metadata?.full_name || "Guest"}</span>
            </h1>
            <p className="font-body text-sm lg:text-base text-muted-foreground max-w-lg">
              {isArabic
                ? "Ù…Ø±Ø¢ØªÙƒ Ø§Ù„Ø´Ø®ØµÙŠØ© â€” Ø±Ø­Ù„Ø© Ø¨Ø´Ø±ØªÙƒ ÙˆØ±ÙˆØªÙŠÙ†Ùƒ Ø§Ù„Ù…ØµÙ…Ù… Ø¨Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ."
                : "Your personal mirror â€” reflecting your skin journey and AI-tailored routine."}
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* â”€â”€â”€ LEFT COLUMN: Profile + Wallet Card â”€â”€â”€ */}
          <div className="lg:col-span-1 space-y-8">
            {/* Avatar & Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: LUXURY_EASE }}
              className="p-8 border border-polished-gold/20"
              style={{ backgroundColor: "hsl(var(--polished-white))" }}
            >
              <div className="flex flex-col items-center gap-4 mb-8">
                <Avatar className="h-24 w-24 border-2 border-polished-gold/40">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-burgundy/10 text-burgundy text-xl font-heading">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="font-heading text-lg text-foreground">{displayName || "Guest"}</h2>
                  <p className="font-body text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {loadingProfile ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs uppercase tracking-wider text-muted-foreground">{isArabic ? "Ø§Ù„Ø§Ø³Ù…" : "Display Name"}</Label>
                    <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={isArabic ? "Ø§Ø³Ù…Ùƒ" : "Your name"} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs uppercase tracking-wider text-muted-foreground">{isArabic ? "Ø§Ù„Ù‡Ø§ØªÙ" : "Phone"}</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+962 ..." />
                  </div>
                  <Button onClick={handleSave} disabled={saving} className="w-full gap-2 bg-burgundy hover:bg-burgundy-dark text-white">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isArabic ? "Ø­ÙØ¸ Ø§Ù„ØªØºÙŠÙŠØ±Ø§Øª" : "Save Changes"}
                  </Button>
                </div>
              )}
            </motion.div>

            {/* â”€â”€â”€ 3D CLINICAL ACCESS CARD â”€â”€â”€ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: LUXURY_EASE }}
              className="flex flex-col items-center gap-6 pb-8"
            >
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-polished-gold">
                {isArabic ? "Ø¨Ø·Ø§Ù‚Ø© Ø§Ù„ÙˆØµÙˆÙ„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ" : "Clinical Access Card"}
              </span>
              <AsperAccessCard
                name={displayName || user.user_metadata?.full_name || "Guest"}
                protocol={skinConcern ? skinConcern.replace("Concern_", "").toUpperCase() : "HYDRATION"}
                ledger={ledgerEntries}
              />
              <button
                className="mt-2 py-3 px-8 font-body text-xs font-semibold uppercase tracking-[0.15em] text-white flex items-center justify-center gap-2 transition-all duration-300 bg-foreground hover:bg-foreground/90"
              >
                <CreditCard className="w-4 h-4" />
                {isArabic ? "Ø£Ø¶Ù Ø¥Ù„Ù‰ Ø§Ù„Ù…Ø­ÙØ¸Ø©" : "Add to Apple Wallet"}
              </button>
              <p className="font-body text-[10px] text-muted-foreground text-center">
                {isArabic ? "Ù…ØªØ§Ø­ Ù‚Ø±ÙŠØ¨Ø§Ù‹" : "Coming soon â€” requires Apple Developer certificates"}
              </p>
            </motion.div>
          </div>

          {/* â”€â”€â”€ RIGHT COLUMN: The Mirror Dashboard â”€â”€â”€ */}
          <div className="lg:col-span-2 space-y-8">
            {/* â”€â”€â”€ Active Protocol Card â”€â”€â”€ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: LUXURY_EASE }}
              className="p-8 lg:p-10 border border-polished-gold/20 relative overflow-hidden"
              style={{ backgroundColor: "hsl(var(--polished-white))" }}
            >
              {/* Gold accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-polished-gold via-polished-gold/60 to-transparent" />

              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className="font-body text-[10px] uppercase tracking-[0.3em] text-polished-gold mb-2 block">
                    {isArabic ? "Ø§Ù„Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ø§Ù„Ù†Ø´Ø·" : "Active Protocol"}
                  </span>
                  <h2 className="font-heading text-2xl lg:text-3xl text-foreground font-bold">
                    {concernLabel
                      ? (isArabic ? concernLabel.ar : concernLabel.en)
                      : (isArabic ? "Ù„Ù… ÙŠØªÙ… Ø§Ù„ØªØ´Ø®ÙŠØµ Ø¨Ø¹Ø¯" : "Not Yet Diagnosed")}
                  </h2>
                  {skinType && (
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      {isArabic ? "Ù†ÙˆØ¹ Ø§Ù„Ø¨Ø´Ø±Ø©: " : "Skin Type: "}
                      <span className="capitalize text-foreground">{skinType}</span>
                    </p>
                  )}
                </div>
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-polished-gold/10 border border-polished-gold/30">
                  <Stethoscope className="w-6 h-6 text-polished-gold" />
                </div>
              </div>

              {/* 3-Step Regimen Display */}
              {skinConcern ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["cleanser", "treatment", "protection"].map((step, i) => {
                    const stepData = routine?.[step] as { title?: string; brand?: string } | undefined;
                    return (
                      <div
                        key={step}
                        className="p-5 border relative overflow-hidden group"
                        style={{
                          borderColor: "hsl(var(--polished-gold) / 0.2)",
                          backgroundColor: "hsl(var(--asper-stone-light))",
                        }}
                      >
                        <span className="font-body text-[9px] uppercase tracking-[0.2em] text-polished-gold block mb-2">
                          {isArabic ? `Ø§Ù„Ø®Ø·ÙˆØ© ${i + 1}` : `Step ${i + 1}`}
                        </span>
                        <p className="font-heading text-xs text-foreground capitalize mb-1">{step}</p>
                        {stepData?.title ? (
                          <>
                            <p className="font-body text-[10px] text-muted-foreground line-clamp-2">{stepData.title}</p>
                            {stepData.brand && (
                              <p className="font-body text-[9px] uppercase tracking-wider text-polished-gold mt-1">{stepData.brand}</p>
                            )}
                          </>
                        ) : (
                          <p className="font-body text-[10px] text-muted-foreground italic">
                            {isArabic ? "Ø§Ø³ØªØ´Ø± Ø§Ù„Ø¯ÙƒØªÙˆØ± Ø³Ø§Ù…ÙŠ" : "Consult Dr. Sami"}
                          </p>
                        )}
                        {/* Shimmer */}
                        <div className="absolute top-0 -left-[150%] w-1/2 h-full bg-gradient-to-r from-transparent via-polished-gold/10 to-transparent -skew-x-[20deg] pointer-events-none group-hover:left-[150%] transition-all duration-700 ease-in-out" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed border-polished-gold/30 bg-asper-stone-light">
                  <Droplets className="w-10 h-10 mx-auto text-polished-gold/40 mb-4" />
                  <p className="font-heading text-sm text-foreground mb-2">
                    {isArabic ? "Ù„Ù… ÙŠØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø±ÙˆØªÙŠÙ† Ø¨Ø¹Ø¯" : "No Routine Created Yet"}
                  </p>
                  <p className="font-body text-xs text-muted-foreground mb-4">
                    {isArabic ? "Ø§Ø¨Ø¯Ø¦ÙŠ Ø§Ø³ØªØ´Ø§Ø±Ø© Ù…Ø¹ Ø§Ù„Ø¯ÙƒØªÙˆØ± Ø³Ø§Ù…ÙŠ Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø±ÙˆØªÙŠÙ† Ù…Ø®ØµØµ" : "Start a consultation with Dr. Sami to get your personalized regimen."}
                  </p>
                  <Link
                    to="/skin-concerns"
                    className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-burgundy font-semibold hover:text-polished-gold transition-colors"
                  >
                    <Stethoscope className="w-4 h-4" />
                    {isArabic ? "Ø§Ø¨Ø¯Ø£ Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±Ø©" : "Start Consultation"}
                  </Link>
                </div>
              )}

              {/* Stats Row */}
              <div className="mt-8 pt-6 border-t border-polished-gold/10 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-heading text-2xl text-foreground">{consultationCount}</p>
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                    {isArabic ? "Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±Ø§Øª" : "Consultations"}
                  </p>
                </div>
                <div>
                  <p className="font-heading text-2xl text-foreground">{skinConcern ? "3" : "0"}</p>
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                    {isArabic ? "Ø®Ø·ÙˆØ§Øª Ø§Ù„Ø±ÙˆØªÙŠÙ†" : "Regimen Steps"}
                  </p>
                </div>
                <div>
                  <p className="font-heading text-2xl text-polished-gold">{concernLabel?.icon || "â€”"}</p>
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                    {isArabic ? "Ø§Ù„Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„" : "Protocol"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* â•â•â• PROTOCOL 6: THE NEXUS â€” Ecosystem Hub â•â•â• */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: LUXURY_EASE }}
              className="relative overflow-hidden border border-polished-gold/20"
              style={{ backgroundColor: "hsl(var(--polished-white))" }}
            >
              {/* Hero image */}
              <div className="relative h-48 lg:h-64 overflow-hidden">
                <img
                  src={nexusHero}
                  alt="The Nexus â€” Ecosystem Hub"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--polished-white))] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="font-body text-[10px] uppercase tracking-[0.3em] text-polished-gold drop-shadow-lg">
                    {isArabic ? "Ø¨Ø±ÙˆØªÙˆÙƒÙˆÙ„ Ù¦ â€” Ø§Ù„Ø´Ø¨ÙƒØ©" : "Protocol 6 â€” The Nexus"}
                  </span>
                </div>
              </div>

              <div className="p-8 lg:p-10">
                <h3 className="font-heading text-xl lg:text-2xl text-foreground font-bold mb-2">
                  {isArabic ? "Ù…Ø±ÙƒØ² Ø§Ù„Ù†Ø¸Ø§Ù… Ø§Ù„Ø¨ÙŠØ¦ÙŠ" : "Your Ecosystem Hub"}
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-8 max-w-lg">
                  {isArabic
                    ? "Ø¨Ø·Ø§Ù‚ØªÙƒ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ù‡ÙŠ Ø¯Ù…Ø§Øº Ø±ÙˆØªÙŠÙ†Ùƒ Ø§Ù„ÙŠÙˆÙ…ÙŠ â€” Ù…ØªØµÙ„Ø© Ø¨Ø§Ù„Ø¯ÙƒØªÙˆØ± Ø³Ø§Ù…ÙŠ ÙˆÙ…Ø³ Ø²ÙŠÙ† ÙˆØ¬Ù…ÙŠØ¹ Ø£Ø¯ÙˆØ§Øª Asper."
                    : "Your Clinical Access Card is the brain of your daily routine â€” connected to Dr. Sami, Ms. Zain, and all Asper tools."}
                </p>

                {/* Ecosystem Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      icon: <Stethoscope className="w-6 h-6" />,
                      label: isArabic ? "Ø§Ù„Ø¯ÙƒØªÙˆØ± Ø³Ø§Ù…ÙŠ" : "Dr. Sami",
                      sub: isArabic ? "Ø§Ø³ØªØ´Ø§Ø±Ø© Ø³Ø±ÙŠØ±ÙŠØ©" : "Clinical Consult",
                      color: "text-burgundy",
                      bg: "bg-burgundy/5",
                      border: "border-burgundy/20",
                      href: "/skin-concerns",
                    },
                    {
                      icon: <Sparkles className="w-6 h-6" />,
                      label: isArabic ? "Ù…Ø³ Ø²ÙŠÙ†" : "Ms. Zain",
                      sub: isArabic ? "Ù…Ø³ØªØ´Ø§Ø±Ø© Ø§Ù„Ø¬Ù…Ø§Ù„" : "Beauty Advisor",
                      color: "text-polished-gold",
                      bg: "bg-polished-gold/5",
                      border: "border-polished-gold/20",
                      href: "/chat",
                    },
                    {
                      icon: <MessageCircle className="w-6 h-6" />,
                      label: "WhatsApp",
                      sub: isArabic ? "Ù…Ø§Ù†ÙŠ Ø´Ø§Øª" : "ManyChat",
                      color: "text-[hsl(142,70%,40%)]",
                      bg: "bg-[hsl(142,70%,40%)]/5",
                      border: "border-[hsl(142,70%,40%)]/20",
                      href: "https://wa.me/962790656666",
                      external: true,
                    },
                    {
                      icon: <Smartphone className="w-6 h-6" />,
                      label: isArabic ? "ØªØªØ¨Ø¹ Ø§Ù„Ø·Ù„Ø¨" : "Track Order",
                      sub: isArabic ? "Ø§Ù„Ø´Ø­Ù† ÙˆØ§Ù„ØªÙˆØµÙŠÙ„" : "Shipping & Delivery",
                      color: "text-foreground",
                      bg: "bg-asper-stone",
                      border: "border-asper-stone-dark",
                      href: "/track-order",
                    },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={cn(
                        "group p-5 border transition-all duration-500 hover:-translate-y-1",
                        item.bg,
                        item.border,
                        "hover:shadow-[0_8px_25px_hsl(var(--polished-gold)/0.12)]"
                      )}
                    >
                      <div className={cn("mb-3", item.color)}>
                        {item.icon}
                      </div>
                      <p className="font-heading text-sm text-foreground font-semibold">{item.label}</p>
                      <p className="font-body text-[10px] text-muted-foreground mt-0.5">{item.sub}</p>
                      {item.external && <ExternalLink className="w-3 h-3 text-muted-foreground mt-2" />}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sign Out */}
            <div className="flex justify-end">
              <Button
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 font-body text-xs uppercase tracking-wider"
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
              >
                {isArabic ? "ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø®Ø±ÙˆØ¬" : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
