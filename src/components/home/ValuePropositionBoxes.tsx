import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ValuePropositionBoxes() {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  const pillars = [
    {
      id: 1,
      titleEn: "Curated Authority",
      titleAr: "Ø³Ù„Ø·Ø© Ù…Ø¹ØªÙ…Ø¯Ø©",
      descriptionEn: "Vetted by Pharmacists. Bridging clinical dermocosmetics with everyday beauty essentials.",
      descriptionAr: "Ù…Ø¹ØªÙ…Ø¯Ø© Ù…Ù† Ø§Ù„ØµÙŠØ§Ø¯Ù„Ø©. Ø±Ø¨Ø· Ù…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„ØªØ¬Ù…ÙŠÙ„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© Ù…Ø¹ Ø§Ù„Ø¬Ù…Ø§Ù„ Ø§Ù„ÙŠÙˆÙ…ÙŠ.",
      icon: (
        <svg className="w-10 h-10 text-polished-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
        </svg>
      )
    },
    {
      id: 2,
      titleEn: "Smart Solutions",
      titleAr: "Ø­Ù„ÙˆÙ„ Ø°ÙƒÙŠØ©",
      descriptionEn: "AI-driven regimen simplification. From your specific skin concern to cart in seconds.",
      descriptionAr: "ØªØ¨Ø³ÙŠØ· Ø§Ù„Ø±ÙˆØªÙŠÙ† Ø¨Ù‚ÙˆØ© Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ. Ù…Ù† Ø§Ù‡ØªÙ…Ø§Ù… Ø¨Ø´Ø±ØªÙƒ Ø¥Ù„Ù‰ Ø§Ù„Ø³Ù„Ø© ÙÙŠ Ø«ÙˆØ§Ù†Ù.",
      icon: (
        <svg className="w-10 h-10 text-polished-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      )
    },
    {
      id: 3,
      titleEn: "Guaranteed Originality",
      titleAr: "Ø£ØµØ§Ù„Ø© Ù…Ø¶Ù…ÙˆÙ†Ø©",
      descriptionEn: "The Gold Standard. Every product is 100% authentic and sourced directly from verified distributors.",
      descriptionAr: "Ø§Ù„Ù…Ø¹ÙŠØ§Ø± Ø§Ù„Ø°Ù‡Ø¨ÙŠ. ÙƒÙ„ Ù…Ù†ØªØ¬ 100Ùª Ø£ØµÙ„ÙŠ ÙˆÙ…ØµØ¯Ø±Ù‡ Ù…Ø¨Ø§Ø´Ø±Ø© Ù…Ù† Ø§Ù„Ù…ÙˆØ²Ø¹ÙŠÙ† Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ÙŠÙ†.",
      icon: (
        <svg className="w-10 h-10 text-polished-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
        </svg>
      )
    }
  ];

  return (
    <section className="bg-asper-stone py-20 lg:py-24 px-6 md:px-12 w-full">
      <div className="luxury-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="group relative bg-polished-white rounded-xl p-8 flex flex-col items-center text-center shadow-sm border border-transparent hover:border-polished-gold hover:shadow-md transition-all duration-500 ease-out overflow-hidden cursor-default"
            >
              {/* Shimmer Light Beam Effect */}
              <div className="absolute top-0 -left-[100%] h-full w-[50%] -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent transition-all duration-700 ease-in-out group-hover:left-[150%] z-10 pointer-events-none"></div>

              {/* Icon Container with Gold Accent */}
              <div className="relative z-0 mb-6 p-4 rounded-full bg-asper-stone group-hover:scale-110 transition-transform duration-500">
                {pillar.icon}
              </div>

              {/* Title: Burgundy & Playfair Display */}
              <h3 className="relative z-0 text-xl font-display text-burgundy mb-3 font-semibold">
                {isAr ? pillar.titleAr : pillar.titleEn}
              </h3>

              {/* Description: Dark text & Montserrat for Readability */}
              <p className="relative z-0 text-sm text-asper-ink/80 leading-relaxed font-body">
                {isAr ? pillar.descriptionAr : pillar.descriptionEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

