import React from 'react';
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface CheckoutTimelineProps {
  currentStep?: number;
}

export const CheckoutTimeline = ({ currentStep = 2 }: CheckoutTimelineProps) => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  // Strict funnel definition. 'Dispense' replaces generic 'Shipping' for clinical authority.
  const stepsEn = [
    { id: 1, label: "Cart Review" },
    { id: 2, label: "Authenticate" },
    { id: 3, label: "Payment" },
    { id: 4, label: "Dispense" }
  ];

  const stepsAr = [
    { id: 1, label: "مراجعة السلة" },
    { id: 2, label: "التوثيق" },
    { id: 3, label: "الدفع" },
    { id: 4, label: "صرف الوصفة" }
  ];

  const steps = isAr ? stepsAr : stepsEn;

  return (
    <div className="w-full bg-[#F8F8FF] py-10 border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        
        <div className={cn("flex items-center justify-between w-full relative", isAr ? "flex-row-reverse" : "flex-row")}>
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const isPending = currentStep < step.id;

            return (
              <React.Fragment key={step.id}>
                {/* The Step Node */}
                <div className="flex flex-col items-center relative z-10">
                  <div 
                    className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-500 shadow-sm border-2",
                      isActive ? 'bg-[#800020] text-white ring-4 ring-[#D4AF37]/30 border-[#D4AF37] scale-110' : '',
                      isCompleted ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : '',
                      isPending ? 'bg-white text-gray-400 border-gray-200' : ''
                    )}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  
                  {/* Absolute positioning prevents text from breaking the flex layout on mobile */}
                  <span 
                    className={cn(
                      "absolute top-12 md:top-14 text-[9px] md:text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-500",
                      isActive ? 'text-[#800020]' : 'text-gray-400',
                      isAr && "font-arabic"
                    )}
                  >
                    {step.label}
                  </span>
                </div>

                {/* The "Gold Stitch" Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="flex-auto h-[2px] mx-2 md:mx-4 bg-gray-200 relative rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-[#D4AF37] transition-all duration-1000 ease-in-out"
                      style={{ width: isCompleted ? '100%' : '0%' }}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default CheckoutTimeline;
