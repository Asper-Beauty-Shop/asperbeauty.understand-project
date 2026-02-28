import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import MomBabyHero from "@/components/mom-baby/MomBabyHero";
import LifecycleNav from "@/components/mom-baby/LifecycleNav";
import ConcernFilters from "@/components/mom-baby/ConcernFilters";
import LifecycleSection from "@/components/mom-baby/LifecycleSection";
import BeautyAdvisors from "@/components/mom-baby/BeautyAdvisors";
import MomBabyBrands from "@/components/mom-baby/MomBabyBrands";
import { useLanguage } from "@/contexts/LanguageContext";

export type LifecyclePhase = "all" | "before-birth" | "after-birth" | "first-years" | "essentials";

export default function MomBaby() {
  const [activePhase, setActivePhase] = useState<LifecyclePhase>("all");
  const [activeConcern, setActiveConcern] = useState<string | null>(null);
  const { locale } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Header />
      <main className="pt-16">
        <MomBabyHero />
        <LifecycleNav activePhase={activePhase} onPhaseChange={setActivePhase} />
        <ConcernFilters activeConcern={activeConcern} onConcernChange={setActiveConcern} />
        <LifecycleSection activePhase={activePhase} activeConcern={activeConcern} />
        <BeautyAdvisors />
        <MomBabyBrands />
      </main>
      <Footer />
    </div>
  );
}
