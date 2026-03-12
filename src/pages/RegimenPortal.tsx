import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShieldCheck, Sun, Moon, Info, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import AsperLogo from "@/components/brand/AsperLogo";

interface RegimenStep {
  step: string;
  product: {
    id: string;
    title: string;
    brand: string;
    price: number;
    image_url: string | null;
  } | null;
  instruction?: string;
  time?: "am" | "pm" | "both";
}

interface PortalData {
  protocolName: string;
  protocolId: string;
  prescribedBy: string;
  steps: RegimenStep[];
  clinicalNote?: string;
}

// Map step labels
const STEP_LABELS: Record<string, string> = {
  cleanser: "Cleanse",
  treatment: "Treat",
  protection: "Protect",
};

function DecryptionScreen() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <ShieldCheck className="w-12 h-12 text-polished-gold animate-pulse mb-4" />
      <p className="font-body text-xs tracking-[0.2em] text-primary uppercase font-bold text-center animate-pulse">
        Decrypting Ledger
        <br />
        Establishing Secure Link
      </p>
    </div>
  );
}

function StepCard({
  index,
  step,
}: {
  index: number;
  step: RegimenStep;
}) {
  if (!step.product) return null;

  const label = STEP_LABELS[step.step] || step.step;
  const instruction =
    step.instruction ||
    (step.step === "cleanser"
      ? "Massage gently for 60 seconds with lukewarm water."
      : step.step === "treatment"
        ? "Apply 2 drops to slightly damp skin to lock in moisture."
        : "Apply generously as last step, reapply every 2 hours in sun.");

  // Staggered delay calculation
  const delay = `${(index + 1) * 300}ms`;

  return (
    <div 
      className="relative pl-6 animate-clinical-reveal" 
      style={{ animationDelay: delay }}
    >
      {/* Timeline dot */}
      <div className="absolute w-2 h-2 bg-background border-2 border-polished-gold rounded-full -left-[4px] top-1" />

      <span className="font-body text-[9px] font-bold text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded">
        Step {String(index + 1).padStart(2, "0")} : {label}
      </span>

      {step.product.image_url && (
        <div className="overflow-hidden rounded bg-card mt-3 shadow-inner">
          <img
            src={step.product.image_url}
            alt={step.product.title}
            className="w-full h-32 object-contain hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        </div>
      )}

      <h3 className="font-heading text-base text-foreground mt-2 leading-tight">
        {step.product.title}
      </h3>

      {step.product.brand && (
        <p className="font-body text-[10px] text-polished-gold tracking-widest uppercase mt-0.5">
          {step.product.brand}
        </p>
      )}

      <p className="font-body text-xs text-muted-foreground mt-1 flex items-start gap-1">
        <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-muted-foreground/60" />
        {instruction}
      </p>

      <p className="font-body text-sm text-foreground font-semibold mt-2">
        {step.product.price?.toFixed(2)} JOD
      </p>
    </div>
  );
}

export default function RegimenPortal() {
  const { id } = useParams<{ id: string }>();
  const [isDecrypting, setIsDecrypting] = useState(true);
  const [portalData, setPortalData] = useState<PortalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const timer = setTimeout(() => setIsDecrypting(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchRegimen() {
      if (!id) return;

      try {
        // Try to load from regimen_plans + steps
        const { data: plan } = await supabase
          .from("regimen_plans")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (plan) {
          const { data: steps } = await supabase
            .from("regimen_steps")
            .select("*")
            .eq("plan_id", id)
            .order("step_number");

          // Fetch products for each step
          const productIds = (steps || [])
            .map((s) => s.product_id)
            .filter(Boolean) as string[];

          const { data: products } = productIds.length
            ? await supabase
                .from("products")
                .select("id, title, brand, price, image_url, regimen_step")
                .in("id", productIds)
            : { data: [] };

          const productMap = new Map(
            (products || []).map((p) => [p.id, p])
          );

          const regimenSteps: RegimenStep[] = (steps || []).map((s) => {
            const product = s.product_id
              ? productMap.get(s.product_id)
              : null;
            const stepName =
              s.step_number === 1
                ? "cleanser"
                : s.step_number === 2
                  ? "treatment"
                  : "protection";
            return {
              step: stepName,
              product: product
                ? {
                    id: product.id,
                    title: product.title,
                    brand: product.brand || "",
                    price: product.price || 0,
                    image_url: product.image_url,
                  }
                : null,
              instruction: s.instruction || undefined,
            };
          });

          setPortalData({
            protocolName: plan.title,
            protocolId: id.slice(0, 8).toUpperCase(),
            prescribedBy: "Dr. Sami",
            steps: regimenSteps,
            clinicalNote: plan.description || undefined,
          });
        } else {
          // Fallback: use get_tray_by_concern with a default
          const { data: tray } = await supabase.rpc("get_tray_by_concern", {
            concern_tag: "Concern_Hydration",
          });

          if (tray) {
            const trayData = tray as Record<string, unknown>;
            const steps: RegimenStep[] = [];
            for (const [key, label] of [
              ["step_1", "cleanser"],
              ["step_2", "treatment"],
              ["step_3", "protection"],
            ]) {
              const p = trayData[key] as Record<string, unknown> | null;
              if (p && p.id) {
                steps.push({
                  step: label,
                  product: {
                    id: p.id as string,
                    title: p.title as string,
                    brand: (p.brand as string) || "",
                    price: (p.price as number) || 0,
                    image_url: (p.image_url as string) || null,
                  },
                });
              }
            }
            setPortalData({
              protocolName: "Hydration & Barrier Defense",
              protocolId: (id || "DEFAULT").slice(0, 8).toUpperCase(),
              prescribedBy: "Dr. Sami",
              steps,
            });
          }
        }
      } catch (err) {
        console.error("Portal fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRegimen();
  }, [id]);

  if (isDecrypting) return <DecryptionScreen />;

  const total =
    portalData?.steps.reduce(
      (sum, s) => sum + (s.product?.price || 0),
      0
    ) || 0;

  const handleFulfill = () => {
    portalData?.steps.forEach((s) => {
      if (s.product) {
        addItem({
          id: s.product.id,
          title: s.product.title,
          price: s.product.price,
          image: s.product.image_url || "/editorial-showcase-2.jpg",
          quantity: 1,
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto shadow-2xl relative pb-36">
      {/* Header */}
      <header className="p-6 border-b border-polished-gold/20 bg-card">
        <div className="flex justify-between items-start mb-4">
          <AsperLogo size={48} />
          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-200">
            <ShieldCheck className="w-3 h-3 text-green-700" />
            <span className="font-body text-[9px] text-green-700 font-bold tracking-wider">
              VERIFIED
            </span>
          </div>
        </div>

        <div className="bg-foreground p-4 rounded-lg">
          <p className="font-body text-[10px] text-polished-gold tracking-widest uppercase mb-1">
            Target Protocol
          </p>
          <p className="font-heading text-lg text-primary-foreground">
            {isLoading
              ? "Loading..."
              : portalData?.protocolName || "Clinical Protocol"}
          </p>
          <div className="flex justify-between items-center mt-3 border-t border-muted-foreground/30 pt-3">
            <span className="font-body text-[10px] text-muted-foreground/70">
              Prescribed by {portalData?.prescribedBy || "Dr. Sami"}
            </span>
            <span className="font-body text-[10px] text-muted-foreground/70">
              ID: REQ-{portalData?.protocolId || "0000"}
            </span>
          </div>
        </div>
      </header>

      {/* Timeline */}
      <main className="p-6">
        {/* AM Routine */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sun className="w-4 h-4 text-polished-gold" />
            <h2 className="font-heading text-lg text-foreground">
              Morning Ritual
            </h2>
          </div>

          <div className="relative border-l border-polished-gold/30 ml-2 space-y-6">
            {portalData?.steps.map((step, i) => (
              <StepCard key={step.product?.id || i} index={i} step={step} />
            ))}
          </div>
        </div>

        {/* Clinical Note */}
        {portalData?.clinicalNote && (
          <div className="bg-card border border-polished-gold/20 p-4 rounded-lg shadow-sm">
            <p className="font-heading italic text-sm text-foreground leading-relaxed">
              "{portalData.clinicalNote}"
            </p>
            <p className="font-body text-[10px] text-primary font-bold uppercase mt-2 tracking-widest text-right">
              â€” {portalData.prescribedBy}
            </p>
          </div>
        )}
      </main>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
        <div className="flex justify-between items-end mb-3 px-2">
          <span className="font-body text-xs text-muted-foreground uppercase tracking-widest">
            Protocol Total
          </span>
          <span className="font-heading text-xl text-foreground">
            {total.toFixed(2)} JOD
          </span>
        </div>
        <Button
          variant="luxury"
          size="luxury-lg"
          className="w-full"
          onClick={handleFulfill}
        >
          <Lock className="w-4 h-4" />
          Securely Fulfill Regimen
        </Button>
      </div>
    </div>
  );
}
