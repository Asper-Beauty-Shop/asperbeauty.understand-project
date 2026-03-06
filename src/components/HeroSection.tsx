import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, MessageSquare, Star, ShieldCheck } from "lucide-react";
import { AnimatedTrustBadge } from "./AnimatedTrustBadge";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#FFF8E1] via-[#FFFDF5] to-[#FFF8E1]">
      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 lg:py-24">
        
        {/* Floating Expertise Badge */}
        <div className="mb-12 animate-fade-in flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#D4AF37]/30 shadow-sm" style={{ animationDelay: "0.1s" }}>
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[10px] uppercase tracking-widest text-asper-charcoal/80 font-semibold">
            {isAr ? "Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€žÃ˜Â§Ã™â€¦Ã˜Â© Ã˜Â§Ã™â€žÃ˜ÂªÃ˜Â¬Ã˜Â§Ã˜Â±Ã™Å Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â£Ã™Ë†Ã™â€žÃ™â€° Ã™â€žÃ™â€žÃ˜Â¬Ã™â€¦Ã˜Â§Ã™â€ž Ã˜Â§Ã™â€žÃ˜Â·Ã˜Â¨Ã™Å " : "The #1 Pharmacist-Verified Beauty Destination"}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-asper-charcoal mb-6 drop-shadow-sm text-center animate-fade-in tracking-tight"      
          style={{ animationDelay: "0.3s" }}
          dir={isAr ? "rtl" : "ltr"}
        >
          {isAr ? "Ã˜Â§Ã™Æ’Ã˜ÂªÃ˜Â´Ã™Ã™Å  Ã˜Â·Ã™â€šÃ™Ë†Ã˜Â³Ã™Æ’ Ã˜Â§Ã™â€žÃ˜Â¬Ã™â€¦Ã˜Â§Ã™â€žÃ™Å Ã˜Â©" : "Discover Your Ritual"}
        </h1>

        {/* Sub-Headline */}
        <p
          className="max-w-2xl text-xl md:text-2xl text-asper-charcoal/70 font-sans mb-12 text-center animate-fade-in leading-relaxed"
          style={{ animationDelay: "0.5s" }}
          dir={isAr ? "rtl" : "ltr"}
        >
          {isAr
            ? "Ã™â€¦Ã™â€ Ã˜ÂªÃ˜Â¬Ã˜Â§Ã˜Âª Ã™Ã˜Â§Ã˜Â®Ã˜Â±Ã˜Â© Ã™â€žÃ™â€žÃ˜Â¹Ã™â€ Ã˜Â§Ã™Å Ã˜Â© Ã˜Â¨Ã˜Â§Ã™â€žÃ˜Â¨Ã˜Â´Ã˜Â±Ã˜Â© Ã™Ë†Ã˜Â§Ã™â€žÃ˜Â¬Ã™â€¦Ã˜Â§Ã™â€ž Ã™â€¦Ã™â€  Ã˜Â£Ã˜Â±Ã™â€šÃ™â€° Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€žÃ˜Â§Ã™â€¦Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜ÂªÃ˜Â¬Ã˜Â§Ã˜Â±Ã™Å Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â§Ã™â€žÃ™â€¦Ã™Å Ã˜Â© â€” Ã™â€¦Ã˜Â¹Ã˜ÂªÃ™â€¦Ã˜Â¯Ã˜Â© Ã˜ÂµÃ™Å Ã˜Â¯Ã™â€žÃ˜Â§Ã™â€ Ã™Å Ã˜Â§Ã™â€¹"
            : "Curated luxury skincare & beauty from the world's most prestigious brands â€” pharmacist verified for your peace of mind."}
        </p>

        {/* Social Proof Strip */}
        <div className="flex items-center gap-8 mb-12 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="flex -space-x-3 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-[#FFF8E1]" />
            ))}
          </div>
          <div className="text-sm font-sans text-asper-charcoal/60">
            <div className="flex items-center gap-1 text-[#D4AF37] mb-0.5">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3 h-3 fill-current" />)}
            </div>
            <p>{isAr ? "+10,000 Ã˜Â§Ã˜Â³Ã˜ÂªÃ˜Â´Ã˜Â§Ã˜Â±Ã˜Â© Ã™â€¦Ã™â€  Ã˜Â¯. Ã˜Â£Ã˜Â³Ã˜Â¨Ã˜Â±" : "10k+ consultations with Dr. Asper"}</p>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div
          className="flex flex-col gap-5 sm:flex-row animate-fade-in"
          style={{ animationDelay: "0.7s" }}
        >
          <Button
            asChild
            size="lg"
            className="bg-[#800020] hover:bg-[#5E0017] text-white font-bold px-12 py-7 text-lg hover:shadow-[0_12px_40px_rgba(128,0,32,0.5)] transition-all duration-300 hover:scale-105 rounded-full"
          >
            <Link to="/shop">
              {isAr ? "Ã˜ÂªÃ˜Â³Ã™Ë†Ã™â€˜Ã™â€šÃ™Å  Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â¬Ã™â€¦Ã™Ë†Ã˜Â¹Ã˜Â©" : "Shop Collection"}
              <ArrowRight className={`h-5 w-5 ${isAr ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group relative border-2 border-[#D4AF37] text-asper-charcoal px-12 py-7 text-lg hover:bg-[#D4AF37] hover:text-white transition-all duration-500 rounded-full overflow-hidden"
          >
            <Link to="/skin-concerns">
              <span className="relative z-10 flex items-center">
                <MessageSquare className={`h-5 w-5 ${isAr ? 'ms-2' : 'me-2'} group-hover:animate-pulse`} />
                {isAr ? "Ã˜Â§Ã˜Â³Ã˜ÂªÃ˜Â´Ã™Å Ã˜Â±Ã™Å  Ã˜Â¯. Ã˜Â£Ã˜Â³Ã˜Â¨Ã˜Â±" : "Consult Dr. Asper"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
          </Button>
        </div>

        {/* Visual Showcase - Floating Video Card */}
        <div
          className="relative w-full max-w-6xl mx-auto mt-24 animate-fade-in"
          style={{ animationDelay: "1s" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent blur-3xl -z-10 rounded-[3rem]" />
          <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
            <video
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              className={`w-full aspect-[21/9] object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
            {/* Dark gradient overlay for bottom text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-10 left-10 text-white font-serif">
              <p className="text-xs uppercase tracking-[0.5em] mb-2">{isAr ? "Ã˜Â§Ã™â€žÃ˜Â¬Ã™Ë†Ã˜Â¯Ã˜Â© Ã˜Â§Ã™â€žÃ˜Â£Ã˜ÂµÃ™Å Ã™â€žÃ˜Â©" : "Authentic Quality"}</p>
              <h3 className="text-3xl font-bold">{isAr ? "Ã˜ÂªÃ˜Â¬Ã˜Â±Ã˜Â¨Ã˜Â© Ã˜Â£Ã˜Â³Ã˜Â¨Ã˜Â±" : "The Asper Experience"}</h3>
            </div>
          </div>
        </div>

      </div>

      {/* --- SCROLL INDICATOR --- */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="flex h-12 w-7 items-start justify-center rounded-full border-2 border-[#D4AF37]/60 bg-white/70 pt-2 backdrop-blur-sm shadow-xl">
          <div className="h-2.5 w-1 rounded-full bg-[#D4AF37]" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;