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
  Concern_Hydration: { en: "Hydration Protocol", ar: "بروتوكول الترطيب", icon: "💧" },
  Concern_Acne: { en: "Acne Protocol", ar: "بروتوكول حب الشباب", icon: "🎯" },
  Concern_Aging: { en: "Anti-Aging Protocol", ar: "بروتوكول مكافحة الشيخوخة", icon: "✨" },
  Concern_Sensitivity: { en: "Sensitivity Protocol", ar: "بروتوكول البشرة الحساسة", icon: "🛡️" },
  Concern_Pigmentation: { en: "Pigmentation Protocol", ar: "بروتوكول التصبغات", icon: "🌟" },
  Concern_AntiAging: { en: "Anti-Aging Protocol", ar: "بروتوكول مكافحة الشيخوخة", icon: "✨" },
  Concern_Dryness: { en: "Dryness Protocol", ar: "بروتوكول الجفاف", icon: "🏜️" },
  Concern_Redness: { en: "Redness Protocol", ar: "بروتوكول الاحمرار", icon: "🌸" },
  Concern_Oiliness: { en: "Oil Control Protocol", ar: "بروتوكول التحكم بالزيوت", icon: "💎" },
  Concern_Brightening: { en: "Brightening Protocol", ar: "بروتوكول التفتيح", icon: "☀️" },
  Concern_SunProtection: { en: "Sun Shield Protocol", ar: "بروتوكول الحماية من الشمس", icon: "🛡️" },
  Concern_DarkCircles: { en: "Dark Circle Protocol", ar: "بروتوكول الهالات السوداء", icon: "👁️" },
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

      // Consultation count
      const { count } = await supabase
        .from("consultations")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      setConsultationCount(count ?? 0);
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
      toast({ title: isArabic ? "تم التحديث" : "Profile updated", description: isArabic ? "تم حفظ التغييرات" : "Your changes have been saved." });
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

      {/* ═══ PROTOCOL 5: THE MIRROR — Hero ═══ */}
      <section className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
        <img
          src={mirrorHero}
          alt="Asper Clinical Access Card — The Mirror"
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
              {isArabic ? "بروتوكول ٥ — المرآة" : "Protocol 5 — The Mirror"}
            </span>
            <h1 className="font-heading text-3xl lg:text-5xl text-foreground font-bold mb-3">
              {isArabic ? "مرحباً، " : "Welcome, "}
              <span className="text-polished-gold">{displayName || user.user_metadata?.full_name || "Guest"}</span>
            </h1>
            <p className="font-body text-sm lg:text-base text-muted-foreground max-w-lg">
              {isArabic
                ? "مرآتك الشخصية — رحلة بشرتك وروتينك المصمم بالذكاء الاصطناعي."
                : "Your personal mirror — reflecting your skin journey and AI-tailored routine."}
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* ─── LEFT COLUMN: Profile + Wallet Card ─── */}
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
                    <Label className="font-body text-xs uppercase tracking-wider text-muted-foreground">{isArabic ? "الاسم" : "Display Name"}</Label>
                    <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={isArabic ? "اسمك" : "Your name"} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs uppercase tracking-wider text-muted-foreground">{isArabic ? "الهاتف" : "Phone"}</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+962 ..." />
                  </div>
                  <Button onClick={handleSave} disabled={saving} className="w-full gap-2 bg-burgundy hover:bg-burgundy-dark text-white">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isArabic ? "حفظ التغييرات" : "Save Changes"}
                  </Button>
                </div>
              )}
            </motion.div>

            {/* ─── 3D CLINICAL ACCESS CARD ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: LUXURY_EASE }}
              className="flex flex-col items-center gap-6 pb-8"
            >
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-polished-gold">
                {isArabic ? "بطاقة الوصول السريري" : "Clinical Access Card"}
              </span>
              <AsperAccessCard
                name={displayName || user.user_metadata?.full_name || "Guest"}
                protocol={skinConcern ? skinConcern.replace("Concern_", "").toUpperCase() : "HYDRATION"}
              />
              <button
                className="mt-2 py-3 px-8 font-body text-xs font-semibold uppercase tracking-[0.15em] text-white flex items-center justify-center gap-2 transition-all duration-300 bg-foreground hover:bg-foreground/90"
              >
                <CreditCard className="w-4 h-4" />
                {isArabic ? "أضف إلى المحفظة" : "Add to Apple Wallet"}
              </button>
              <p className="font-body text-[10px] text-muted-foreground text-center">
                {isArabic ? "متاح قريباً" : "Coming soon — requires Apple Developer certificates"}
              </p>
            </motion.div>
          </div>

          {/* ─── RIGHT COLUMN: The Mirror Dashboard ─── */}
          <div className="lg:col-span-2 space-y-8">
            {/* ─── Active Protocol Card ─── */}
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
                    {isArabic ? "البروتوكول النشط" : "Active Protocol"}
                  </span>
                  <h2 className="font-heading text-2xl lg:text-3xl text-foreground font-bold">
                    {concernLabel
                      ? (isArabic ? concernLabel.ar : concernLabel.en)
                      : (isArabic ? "لم يتم التشخيص بعد" : "Not Yet Diagnosed")}
                  </h2>
                  {skinType && (
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      {isArabic ? "نوع البشرة: " : "Skin Type: "}
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
                          {isArabic ? `الخطوة ${i + 1}` : `Step ${i + 1}`}
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
                            {isArabic ? "استشر الدكتور سامي" : "Consult Dr. Sami"}
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
                    {isArabic ? "لم يتم إنشاء روتين بعد" : "No Routine Created Yet"}
                  </p>
                  <p className="font-body text-xs text-muted-foreground mb-4">
                    {isArabic ? "ابدئي استشارة مع الدكتور سامي للحصول على روتين مخصص" : "Start a consultation with Dr. Sami to get your personalized regimen."}
                  </p>
                  <Link
                    to="/skin-concerns"
                    className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.15em] text-burgundy font-semibold hover:text-polished-gold transition-colors"
                  >
                    <Stethoscope className="w-4 h-4" />
                    {isArabic ? "ابدأ الاستشارة" : "Start Consultation"}
                  </Link>
                </div>
              )}

              {/* Stats Row */}
              <div className="mt-8 pt-6 border-t border-polished-gold/10 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-heading text-2xl text-foreground">{consultationCount}</p>
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                    {isArabic ? "الاستشارات" : "Consultations"}
                  </p>
                </div>
                <div>
                  <p className="font-heading text-2xl text-foreground">{skinConcern ? "3" : "0"}</p>
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                    {isArabic ? "خطوات الروتين" : "Regimen Steps"}
                  </p>
                </div>
                <div>
                  <p className="font-heading text-2xl text-polished-gold">{concernLabel?.icon || "—"}</p>
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                    {isArabic ? "البروتوكول" : "Protocol"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ═══ PROTOCOL 6: THE NEXUS — Ecosystem Hub ═══ */}
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
                  alt="The Nexus — Ecosystem Hub"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--polished-white))] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="font-body text-[10px] uppercase tracking-[0.3em] text-polished-gold drop-shadow-lg">
                    {isArabic ? "بروتوكول ٦ — الشبكة" : "Protocol 6 — The Nexus"}
                  </span>
                </div>
              </div>

              <div className="p-8 lg:p-10">
                <h3 className="font-heading text-xl lg:text-2xl text-foreground font-bold mb-2">
                  {isArabic ? "مركز النظام البيئي" : "Your Ecosystem Hub"}
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-8 max-w-lg">
                  {isArabic
                    ? "بطاقتك السريرية هي دماغ روتينك اليومي — متصلة بالدكتور سامي ومس زين وجميع أدوات Asper."
                    : "Your Clinical Access Card is the brain of your daily routine — connected to Dr. Sami, Ms. Zain, and all Asper tools."}
                </p>

                {/* Ecosystem Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      icon: <Stethoscope className="w-6 h-6" />,
                      label: isArabic ? "الدكتور سامي" : "Dr. Sami",
                      sub: isArabic ? "استشارة سريرية" : "Clinical Consult",
                      color: "text-burgundy",
                      bg: "bg-burgundy/5",
                      border: "border-burgundy/20",
                      href: "/skin-concerns",
                    },
                    {
                      icon: <Sparkles className="w-6 h-6" />,
                      label: isArabic ? "مس زين" : "Ms. Zain",
                      sub: isArabic ? "مستشارة الجمال" : "Beauty Advisor",
                      color: "text-polished-gold",
                      bg: "bg-polished-gold/5",
                      border: "border-polished-gold/20",
                      href: "/chat",
                    },
                    {
                      icon: <MessageCircle className="w-6 h-6" />,
                      label: "WhatsApp",
                      sub: isArabic ? "ماني شات" : "ManyChat",
                      color: "text-[hsl(142,70%,40%)]",
                      bg: "bg-[hsl(142,70%,40%)]/5",
                      border: "border-[hsl(142,70%,40%)]/20",
                      href: "https://wa.me/962790656666",
                      external: true,
                    },
                    {
                      icon: <Smartphone className="w-6 h-6" />,
                      label: isArabic ? "تتبع الطلب" : "Track Order",
                      sub: isArabic ? "الشحن والتوصيل" : "Shipping & Delivery",
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
                {isArabic ? "تسجيل الخروج" : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
