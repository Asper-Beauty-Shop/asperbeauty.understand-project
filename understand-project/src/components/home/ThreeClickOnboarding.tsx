import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, Droplets, Zap, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from "@/contexts/LanguageContext";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

const STEPS = [
  {
    id: 'skin-type',
    title: { en: 'What is your skin profile?', ar: 'ما هو نوع بشرتكِ؟' },
    options: [
      { id: 'oily', label: { en: 'Oily / Acne-Prone', ar: 'دهنية / معرضة للحبوب' }, icon: Zap },
      { id: 'dry', label: { en: 'Dry / Dehydrated', ar: 'جافة / فاقدة للترطيب' }, icon: Droplets },
      { id: 'sensitive', label: { en: 'Sensitive / Redness', ar: 'حساسة / معرضة للاحمرار' }, icon: Shield },
      { id: 'normal', label: { en: 'Normal / Balanced', ar: 'عادية / متوازنة' }, icon: Sparkles },
    ]
  },
  {
    id: 'primary-concern',
    title: { en: 'Your primary focus?', ar: 'ما هو هدفكِ الأساسي؟' },
    options: [
      { id: 'anti-aging', label: { en: 'Anti-Aging & Firming', ar: 'محاربة الشيخوخة والشد' }, icon: Shield },
      { id: 'brightening', label: { en: 'Brightening & Dark Spots', ar: 'تفتيح وتوحيد اللون' }, icon: Sparkles },
      { id: 'texture', label: { en: 'Texture & Large Pores', ar: 'المسام والنعومة' }, icon: Zap },
      { id: 'barrier', label: { en: 'Barrier Repair', ar: 'ترميم حاجز البشرة' }, icon: Shield },
    ]
  }
];

export default function ThreeClickOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  const handleSelect = (optionId: string) => {
    const newSelections = { ...selections, [STEPS[currentStep].id]: optionId };
    setSelections(newSelections);
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finalize: Navigate to curated shop
      const query = new URLSearchParams(newSelections).toString();
      navigate(`/shop?${query}`);
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: LUXURY_EASE }}
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-polished-gold mb-4 block font-bold">
              {isAr ? "استشارة الـ 3 نقرات" : "The 3-Click Solution"}
            </span>
            <h2 className="font-heading text-3xl md:text-5xl text-asper-ink mb-12 font-light">
              {isAr ? STEPS[currentStep].title.ar : STEPS[currentStep].title.en}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {STEPS[currentStep].options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className="group relative bg-asper-stone-light p-8 text-left border border-transparent hover:border-polished-gold/40 transition-all duration-500 overflow-hidden"
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <opt.icon className="w-6 h-6 text-polished-gold" />
                      <span className="text-lg font-medium text-asper-ink tracking-tight">
                        {isAr ? opt.label.ar : opt.label.en}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-polished-gold opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                  </div>
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}