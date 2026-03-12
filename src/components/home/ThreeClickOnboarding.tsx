import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, Droplets, Zap, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

// Icon mapping for clinical concerns
const CONCERN_ICONS: Record<string, any> = {
  'anti-aging': Shield,
  'hydration': Droplets,
  'acne-control': Zap,
  'barrier-repair': Shield,
  'pigmentation': Sparkles,
  'redness': Droplets,
  'sun-protection': Shield,
};

const STATIC_STEPS = [
  {
    id: 'skin-type',
    title: { en: 'Identify your skin profile.', ar: 'حددي نوع بشرتكِ.' },
    persona: { en: 'Dr. Sami: Accuracy is the foundation of efficacy.', ar: 'د. سامي: الدقة هي أساس الفعالية.' },
    options: [
      { id: 'oily', label: { en: 'Oily / Acne-Prone', ar: 'دهنية / معرضة للحبوب' }, icon: Zap },
      { id: 'dry', label: { en: 'Dry / Dehydrated', ar: 'جافة / فاقدة للترطيب' }, icon: Droplets },
      { id: 'sensitive', label: { en: 'Sensitive / Redness', ar: 'حساسة / معرضة للاحمرار' }, icon: Shield },
      { id: 'normal', label: { en: 'Normal / Balanced', ar: 'عادية / متوازنة' }, icon: Sparkles },
    ]
  },
  {
    id: 'intensity',
    title: { en: 'Preferred treatment intensity?', ar: 'درجة كثافة العلاج المفضلة؟' },
    persona: { en: 'Dr. Sami: Clinical results require consistent discipline.', ar: 'د. سامي: النتائج الطبية تتطلب انضباطاً مستمراً.' },
    options: [
      { id: 'gentle', label: { en: 'Gentle & Preventive', ar: 'لطيف ووقائي' }, icon: Droplets },
      { id: 'standard', label: { en: 'Standard Therapeutic', ar: 'علاجي قياسي' }, icon: Shield },
      { id: 'intensive', label: { en: 'High-Potency Active', ar: 'فعالية عالية ومركزة' }, icon: Zap },
      { id: 'rapid', label: { en: 'Rapid Surface Renewal', ar: 'تجديد سطحي سريع' }, icon: Sparkles },
    ]
  }
];

export default function ThreeClickOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [dynamicConcerns, setDynamicConcerns] = useState<any[]>([]);
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  useEffect(() => {
    const fetchConcerns = async () => {
      try {
        const { data } = await supabase.from('concerns').select('id, name, slug');
        if (data && data.length > 0) {
          setDynamicConcerns(data.map(c => ({
            id: c.slug,
            label: { en: c.name, ar: c.name },
            icon: CONCERN_ICONS[c.slug] || Sparkles
          })));
        } else {
          // Fallback if concerns table is empty
          setDynamicConcerns([
            { id: 'anti-aging', label: { en: 'Anti-Aging', ar: 'محاربة الشيخوخة' }, icon: Shield },
            { id: 'hydration', label: { en: 'Hydration', ar: 'ترطيب' }, icon: Droplets },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic concerns:", err);
      }
    };
    fetchConcerns();
  }, []);

  const steps = [
    STATIC_STEPS[0],
    {
      id: 'primary-concern',
      title: { en: 'Your primary clinical focus?', ar: 'ما هو هدفكِ الطبي الأساسي؟' },
      persona: { en: 'Ms. Zain: We target the concern, but preserve the glow.', ar: 'مس زين: نستهدف المشكلة، ونحافظ على الإشراق.' },
      options: dynamicConcerns.length > 0 ? dynamicConcerns : [
        { id: 'anti-aging', label: { en: 'Anti-Aging & Firming', ar: 'محاربة الشيخوخة والشد' }, icon: Shield },
      ]
    },
    STATIC_STEPS[1]
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleSelect = (optionId: string) => {
    const newSelections = { ...selections, [steps[currentStep].id]: optionId };
    setSelections(newSelections);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finalize: Navigate to curated shop
      const query = new URLSearchParams(newSelections).toString();
      navigate(`/shop?${query}`);
    }
  };

  return (
    <section className="py-24 bg-[#F8F8FF] relative overflow-hidden">
      {/* Clinical Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
        <motion.div 
          className="h-full bg-[#D4AF37]" 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: LUXURY_EASE }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: isAr ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isAr ? 30 : -30 }}
            transition={{ duration: 0.6, ease: LUXURY_EASE }}
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#800020] mb-4 block font-bold">
              {isAr ? "بروتوكول الـ 3 نقرات" : "Protocol: The 3-Click Solution"}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-gray-900 mb-4 font-light">
              {isAr ? steps[currentStep].title.ar : steps[currentStep].title.en}
            </h2>
            <p className="text-xs text-muted-foreground italic mb-12 font-body">
              {isAr ? steps[currentStep].persona.ar : steps[currentStep].persona.en}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {steps[currentStep].options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className="group relative bg-white p-8 text-left border border-gray-100 hover:shadow-[0_10px_40px_rgba(128,0,32,0.05)] transition-all duration-500 overflow-hidden rounded-xl"
                >
                  {/* THE GOLD STITCH MICRO-INTERACTION */}
                  <div className="absolute top-0 left-0 h-[2px] w-full bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10"></div>

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#F8F8FF] flex items-center justify-center group-hover:bg-[#800020]/5 transition-colors duration-500">
                        <opt.icon className="w-5 h-5 text-[#800020]" />
                      </div>
                      <span className="text-lg font-medium text-gray-800 tracking-tight group-hover:text-[#800020] transition-colors duration-500">
                        {isAr ? opt.label.ar : opt.label.en}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
