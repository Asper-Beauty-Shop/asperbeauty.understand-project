import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Instagram, Send, Sparkles, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SocialBeautyExpert = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <section className="relative py-24 overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FFF8E1] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FFFDF5] rounded-full blur-[120px]" />
      </div>

      <div className="luxury-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Content */}
          <div className={`space-y-8 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-sans text-sm tracking-wide animate-fade-in">
              <Sparkles className="w-4 h-4 me-2" />
              <span>{isAr ? 'Ø®Ø¨ÙŠØ± Ø§Ù„Ø¬Ù…Ø§Ù„ Ø§Ù„Ø°ÙƒÙŠ' : 'AI Beauty Expert'}</span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-asper-charcoal leading-tight">
              {isAr ? 'Ø·Ø¨ÙŠØ¨Ùƒ Ø§Ù„Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø®Ø§ØµØŒ ÙÙŠ ÙƒÙ„ Ù…ÙƒØ§Ù†' : 'Your Personal Beauty Expert, Everywhere'}
            </h2>

            <p className="text-lg text-asper-charcoal/70 font-sans leading-relaxed max-w-xl">
              {isAr 
                ? 'Ù…Ù† Ø±Ø³Ø§Ø¦Ù„ Ø¥Ù†Ø³ØªÙ‚Ø±Ø§Ù… Ø¥Ù„Ù‰ ÙˆØ§ØªØ³Ø§Ø¨ØŒ Ø¯. Ø£Ø³Ø¨Ø± Ø¬Ø§Ù‡Ø² Ù„ØªØ­Ù„ÙŠÙ„ Ø¨Ø´Ø±ØªÙƒ ÙˆÙˆØµÙ Ø§Ù„Ø±ÙˆØªÙŠÙ† Ø§Ù„Ù…Ø«Ø§Ù„ÙŠ Ù„ÙƒÙÙŠ Ø«ÙˆØ§Ù†ÙŠ.' 
                : 'From Instagram DMs to WhatsApp, Dr. Asper is ready to analyze your skin and prescribe the perfect ritual in seconds. Real-time expertise, pharmacist-verified.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-6 rounded-2xl bg-cream/30 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 group">
                <Instagram className="w-8 h-8 text-[#E4405F] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-asper-charcoal mb-2">{isAr ? 'Ø¥Ù†Ø³ØªÙ‚Ø±Ø§Ù…' : 'Instagram'}</h3>
                <p className="text-sm text-asper-charcoal/60">{isAr ? 'Ø£Ø±Ø³Ù„ "Routine" Ù„Ù„Ø¨Ø¯Ø¡ ÙÙˆØ±Ø§Ù‹' : 'DM "Routine" to start instantly'}</p>
              </div>
              <div className="p-6 rounded-2xl bg-cream/30 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 group">
                <MessageCircle className="w-8 h-8 text-[#25D366] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-asper-charcoal mb-2">{isAr ? 'ÙˆØ§ØªØ³Ø§Ø¨' : 'WhatsApp'}</h3>
                <p className="text-sm text-asper-charcoal/60">{isAr ? 'Ø§Ø³ØªØ´Ø§Ø±Ø© Ù…Ø¨Ø§Ø´Ø±Ø© Ù…Ø¹ Ø¯. Ø£Ø³Ø¨Ø±' : 'Direct consultation with Dr. Asper'}</p>
              </div>
            </div>

            <div className="pt-6">
              <Button size="lg" className="bg-[#D4AF37] hover:bg-[#B8962E] text-white rounded-full px-8 py-6 text-lg group">
                {isAr ? 'ØªØ­Ø¯Ø« Ù…Ø¹ Ø¯. Ø£Ø³Ø¨Ø± Ø§Ù„Ø¢Ù†' : 'Chat with Dr. Asper Now'}
                <Send className="ms-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Right Side: Mockup */}
          <div className="relative flex justify-center items-center">
            {/* Phone Mockup Wrapper */}
            <div className="relative w-[300px] h-[600px] bg-asper-charcoal rounded-[3rem] border-8 border-asper-charcoal shadow-2xl overflow-hidden animate-float">
              {/* Screen Content */}
              <div className="absolute inset-0 bg-white">
                {/* Header */}
                <div className="bg-[#FFF8E1] p-4 flex items-center gap-3 border-b border-[#D4AF37]/20">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center">
                    <ShieldCheck className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Dr. Asper</p>
                    <p className="text-[10px] text-[#25D366]">Online • Beauty Expert</p>
                  </div>
                </div>
                {/* Chat Bubbles */}
                <div className="p-4 space-y-4 font-sans">
                  <div className="bg-cream/50 rounded-2xl p-3 rounded-tl-none max-w-[85%] text-sm">
                    {isAr ? 'Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨Ùƒ! Ø£Ù†Ø§ Ø¯. Ø£Ø³Ø¨Ø±. ÙƒÙŠÙ Ø­Ø§Ù„ Ø¨Ø´Ø±ØªÙƒ Ø§Ù„ÙŠÙˆÙ…ØŸ' : 'Hello! I am Dr. Asper. How is your skin feeling today?'}
                  </div>
                  <div className="bg-[#D4AF37] text-white rounded-2xl p-3 rounded-tr-none max-w-[80%] ms-auto text-sm">
                    {isAr ? 'Ø£Ø¹Ø§Ù†ÙŠ Ù…Ù† Ø¨Ø¹Ø¶ Ø§Ù„Ø¬ÙØ§Ù ÙˆØ§Ù„Ø¨Ù‡ØªØ§Ù†.' : 'My skin feels a bit dry and dull lately.'}
                  </div>
                  <div className="bg-cream/50 rounded-2xl p-3 rounded-tl-none max-w-[85%] text-sm">
                    {isAr ? 'ÙÙ‡Ù…ØªÙƒ. Ø£Ù†ØµØ­Ùƒ Ø¨Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø³ÙŠØ±ÙˆÙ… Ø§Ù„Ù‡ÙŠØ§Ù„ÙˆØ±ÙˆÙ†ÙŠÙƒ Ø£Ø³ÙŠØ¯...' : 'I see. I recommend starting with a Hyaluronic Acid serum...'}
                  </div>
                </div>
                {/* Product Card in Chat */}
                <div className="px-4">
                  <div className="border border-[#D4AF37]/30 rounded-xl p-2 flex items-center gap-3 bg-white shadow-sm">
                    <div className="w-12 h-12 bg-cream rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold truncate">Vichy MinÃ©ral 89</p>
                      <p className="text-[9px] text-asper-charcoal/60">Hydrating Serum</p>
                    </div>
                    <Button size="sm" className="h-7 text-[10px] bg-[#D4AF37] px-2">{isAr ? 'Ø´Ø±Ø§Ø¡' : 'Buy'}</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Accents */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-cream rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl" />
          </div>

        </div>
      </div>

      <style>
        {`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        `}
      </style>
    </section>
  );
};

export default SocialBeautyExpert;