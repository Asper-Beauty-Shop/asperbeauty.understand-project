import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Leaf, Sparkles, Sun, Moon, CloudSun, FlaskConical, Droplets, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTimeContext } from "@/hooks/useTimeContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const timeIcons = { morning: Sun, afternoon: CloudSun, evening: Moon };

const stepIcon = (step: string) => {
  if (step.includes("1")) return FlaskConical;
  if (step.includes("2")) return Sparkles;
  if (step.includes("3")) return Droplets;
  return Package;
};

const stepLabel = (step: string) => {
  if (step.includes("1")) return "Cleanser";
  if (step.includes("2")) return "Treatment";
  if (step.includes("3")) return "Protection";
  return "Essentials";
};

const fallbackProducts = [
  { title: "Retinol Night Treatment", brand: "Asper Beauty", price: 68, step: "Treatment", icon: FlaskConical },
  { title: "Vitamin C Brightening Cream", brand: "Asper Beauty", price: 52, step: "Protection", icon: Sparkles },
  { title: "Nourishing Hair Oil", brand: "Kérastase", price: 32, step: "Nourish", icon: Droplets },
];

export default function Hero() {
  const { t, dir, locale } = useLanguage();
  const { timeOfDay, greeting } = useTimeContext();
  const TimeIcon = timeIcons[timeOfDay];
  const isAr = locale === "ar";

  const { data: dbProducts } = useQuery({
    queryKey: ["hero-tray-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("title, brand, price, regimen_step, image_url")
        .eq("is_hero", true)
        .order("bestseller_rank", { ascending: true, nullsFirst: false })
        .limit(3);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const trayProducts = dbProducts && dbProducts.length > 0
    ? dbProducts.map((p) => ({
        title: p.title,
        brand: p.brand || "Asper Beauty",
        price: p.price ?? 0,
        step: stepLabel(p.regimen_step),
        icon: stepIcon(p.regimen_step),
      }))
    : fallbackProducts;

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] overflow-hidden bg-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 h-full">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-16 items-center min-h-[85vh] lg:min-h-[90vh] py-16 lg:py-0">

          {/* ── LEFT COLUMN (2/5 = 40%) — Emotional Hook ── */}
          <motion.div
            className={cn("lg:col-span-2 space-y-8", dir === "rtl" && "text-right")}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            {/* Time-aware greeting pill */}
            <div className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-body tracking-wide",
              "bg-secondary text-muted-foreground border border-border"
            )}>
              <TimeIcon className="h-3.5 w-3.5 text-accent" />
              <span>{greeting}</span>
            </div>

            <div className="space-y-4">
              <h1 className={cn(
                "font-heading text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold text-foreground leading-[1.08] tracking-tight",
                dir === "rtl" && "font-arabic"
              )}>
                {isAr ? (
                  <>
                    محراب <span className="text-primary">العلم</span>
                    <br />
                    <span className="text-accent">&</span> الفخامة
                  </>
                ) : (
                  <>
                    The Sanctuary
                    <br />
                    of <span className="text-primary">Science</span> <span className="text-accent">&</span> Luxury
                  </>
                )}
              </h1>

              <p className={cn(
                "text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed",
                dir === "rtl" ? "font-arabic" : "font-body"
              )}>
                {isAr
                  ? "منتجات فاخرة للعناية بالبشرة مُعتمدة من صيادلتنا الخبراء. دعي ذكاءنا الاصطناعي يصمّم روتينك المثالي بـ3 نقرات."
                  : "Experience clinical dermocosmetics curated by expert pharmacists. Let our AI formulate your personalized, 3‑click beauty regimen."}
              </p>
            </div>

            {/* Trust micro-badges */}
            <div className={cn("flex flex-wrap gap-3", dir === "rtl" && "justify-end")}>
              {[
                { icon: Shield, label: isAr ? "أصالة مضمونة" : "100% Authentic" },
                { icon: Leaf, label: isAr ? "خالٍ من القسوة" : "Cruelty-Free" },
                { icon: Sparkles, label: isAr ? "بإشراف صيدلاني" : "Pharmacist-Led" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 text-xs font-body text-muted-foreground border border-border rounded-full px-3 py-1 bg-card"
                >
                  <item.icon className="h-3 w-3 text-accent" />
                  {item.label}
                </span>
              ))}
            </div>

            {/* Single CTA */}
            <div className={cn("pt-2", dir === "rtl" && "flex justify-end")}>
              <Link to="/intelligence">
                <Button
                  size="lg"
                  className="group bg-card text-foreground border border-accent hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/10 text-sm uppercase tracking-widest px-8 h-13 font-semibold transition-all duration-300"
                >
                  {isAr ? "ابدئي تحليل بشرتك" : "Start Free Skin Analysis"}
                  <ArrowRight className={cn(
                    "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1",
                    dir === "rtl" ? "mr-2 rotate-180 group-hover:-translate-x-1" : "ml-2"
                  )} />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN (3/5 = 60%) — Digital Tray ── */}
          <motion.div
            className="lg:col-span-3 relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
              {/* Background decorative circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-square rounded-full bg-gradient-to-br from-accent/5 via-primary/5 to-transparent" />

              {/* Product tray cards */}
              <div className="relative space-y-4 py-8">
                {trayProducts.map((product, i) => (
                  <motion.div
                    key={product.title}
                    className={cn(
                      "relative bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-lg hover:border-accent/40 transition-all duration-300 group",
                      i === 0 && "lg:ml-4",
                      i === 1 && "lg:ml-12",
                      i === 2 && "lg:ml-6",
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.15, ease: [0.19, 1, 0.22, 1] }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors">
                        <product.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-body uppercase tracking-[0.2em] text-muted-foreground">{product.brand}</p>
                        <p className="text-sm font-heading font-semibold text-foreground truncate">{product.title}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-foreground">{Number(product.price).toFixed(2)} <span className="text-xs text-muted-foreground">JOD</span></p>
                        <span className="text-[10px] font-body uppercase tracking-wider text-accent">{product.step}</span>
                      </div>
                    </div>
                    {/* Gold stitch on hover */}
                    <div className="absolute inset-0 rounded-xl border border-accent/0 group-hover:border-accent/60 transition-colors duration-300 pointer-events-none" />
                  </motion.div>
                ))}
              </div>

              {/* AI Concierge chat bubble */}
              <motion.div
                className="absolute -top-2 right-0 lg:right-4 w-64 bg-card/95 backdrop-blur-sm rounded-2xl border border-accent/30 p-4 shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9, ease: [0.19, 1, 0.22, 1] }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-xs font-body font-semibold text-foreground">
                    {isAr ? "✨ الآنسة زين" : "✨ Ms. Zain"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  {isAr
                    ? "بناءً على بشرتك، أنصحك بروتين ترطيب مسائي مخصص ✨"
                    : "Based on your skin profile, I recommend this evening hydration ritual ✨"}
                </p>
              </motion.div>

              {/* Clinical badge floating */}
              <motion.div
                className="absolute bottom-4 left-0 lg:left-4 inline-flex items-center gap-2 bg-card/95 backdrop-blur-sm rounded-full border border-primary/20 px-4 py-2 shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1, ease: [0.19, 1, 0.22, 1] }}
              >
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-xs font-body font-medium text-foreground">
                  {isAr ? "🔬 Dr. سامي — معتمد سريرياً" : "🔬 Dr. Sami — Clinically Verified"}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom divider accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
    </section>
  );
}
