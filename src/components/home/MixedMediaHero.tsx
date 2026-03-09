import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import heroDiscovery from "@/assets/hero-serum-discovery-wide.png";

const LUXURY_EASE = [0.19, 1, 0.22, 1] as const;

export default function MixedMediaHero() {
  const { locale, dir } = useLanguage();
  const isAr = locale === "ar";

  return (
    <section className="relative w-full bg-background overflow-hidden">
      {/* â”€â”€ Desktop: 2Ã—2 Split Grid â”€â”€ */}
      <div className="hidden md:grid grid-cols-2 grid-rows-2 min-h-[90vh]">
        {/* Cell 1 â€” Video (top-left) */}
        <div className="relative overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/hero-spa-ritual.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Cell 2 â€” Copy + CTA (top-right) */}
        <div className="flex flex-col justify-center px-12 lg:px-20 py-16 bg-background">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: LUXURY_EASE }}
          >
            <span className="font-body text-[10px] uppercase tracking-[0.35em] text-accent mb-4 block">
              {isAr ? "Ø°ÙƒÙŠ. Ø£ØµÙŠÙ„. Ø®Ø§Ù„Ø¯." : "Intelligent Â· Authentic Â· Eternal"}
            </span>

            <h1
              className={cn(
                "font-display text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.05] text-burgundy mb-4",
                isAr && "font-arabic text-right"
              )}
            >
              {isAr ? (
                <>
                  Ù…ÙÙ†ØªÙ‚Ø§Ø© Ù…Ù†{" "}
                  <span className="text-polished-gold">Ø§Ù„ØµÙŠØ§Ø¯Ù„Ø©.</span>
                  <br />
                  Ù…Ø¯Ø¹ÙˆÙ…Ø© Ø¨Ø§Ù„Ø°ÙƒØ§Ø¡.
                </>
              ) : (
                <>
                  Curated by Pharmacists.
                  <br />
                  <span className="text-polished-gold italic">
                    Powered by Intelligence.
                  </span>
                </>
              )}
            </h1>

            <p
              className={cn(
                "font-body text-base lg:text-lg text-foreground/80 max-w-md leading-relaxed mb-8",
                isAr && "font-arabic text-right"
              )}
            >
              {isAr
                ? "Ø­Ù„ÙˆÙ„ Ø·Ø¨ÙŠØ© Ù…ÙˆØ«ÙˆÙ‚Ø© Ù„Ø¥Ø´Ø±Ø§Ù‚Ø© Ø®Ø§Ù„Ø¯Ø© â€” Ù…Ù† Ø§Ù„ØµÙŠØ¯Ù„ÙŠ Ø¥Ù„ÙŠÙƒÙ Ù…Ø¨Ø§Ø´Ø±Ø©."
                : "Trusted clinical solutions for ageless radiance â€” dispensed directly from the pharmacist's shelf to you."}
            </p>

            <div className={cn("flex items-center gap-4", isAr && "flex-row-reverse")}>
              <Link to="/shop">
                <Button
                  size="lg"
                  className="group bg-burgundy text-white hover:bg-burgundy-dark
                             text-sm uppercase tracking-[0.2em] px-10 h-14 font-semibold
                             rounded-none transition-all duration-[400ms] hover:scale-105
                             shadow-maroon-glow hover:shadow-maroon-deep"
                >
                  {isAr ? "ØªØ³ÙˆÙ‚ÙŠ Ø§Ù„Ø¢Ù†" : "Shop Now"}
                  <ArrowRight
                    className={cn(
                      "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1",
                      dir === "rtl" && "mr-2 rotate-180 group-hover:-translate-x-1",
                      dir === "ltr" && "ml-2"
                    )}
                  />
                </Button>
              </Link>

              <Link
                to="/skin-concerns"
                className="font-body text-xs uppercase tracking-[0.2em] text-burgundy
                           border-b border-burgundy/30 hover:border-burgundy pb-1
                           transition-all duration-[400ms]"
              >
                {isAr ? "Ø§Ø¨Ø¯Ø¦ÙŠ Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±Ø©" : "Begin Consultation"}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Cell 3 â€” Wide landscape image spanning both columns */}
        <div className="relative overflow-hidden col-span-2">
          <motion.img
            src={heroDiscovery}
            alt="Discover your ideal serum â€” ISDIN, Vichy, La Mer"
            className="w-full h-full object-cover max-h-[45vh]"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: LUXURY_EASE }}
          />
        </div>
      </div>

      {/* â”€â”€ Mobile: Stacked Layout â”€â”€ */}
      <div className="md:hidden">
        {/* Video */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/hero-spa-ritual.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Copy */}
        <div className="px-6 py-10 bg-background">
          <span className="font-body text-[10px] uppercase tracking-[0.35em] text-accent mb-3 block">
            {isAr ? "Ø°ÙƒÙŠ. Ø£ØµÙŠÙ„. Ø®Ø§Ù„Ø¯." : "Intelligent Â· Authentic Â· Eternal"}
          </span>

          <h1
            className={cn(
              "font-display text-3xl font-bold leading-[1.1] text-burgundy mb-3",
              isAr && "font-arabic text-right"
            )}
          >
            {isAr ? (
              <>Ù…ÙÙ†ØªÙ‚Ø§Ø© Ù…Ù† <span className="text-polished-gold">Ø§Ù„ØµÙŠØ§Ø¯Ù„Ø©.</span></>
            ) : (
              <>
                Curated by Pharmacists.
                <br />
                <span className="text-polished-gold italic">Powered by Intelligence.</span>
              </>
            )}
          </h1>

          <p
            className={cn(
              "font-body text-sm text-foreground/80 leading-relaxed mb-6",
              isAr && "font-arabic text-right"
            )}
          >
            {isAr
              ? "Ø­Ù„ÙˆÙ„ Ø·Ø¨ÙŠØ© Ù…ÙˆØ«ÙˆÙ‚Ø© Ù„Ø¥Ø´Ø±Ø§Ù‚Ø© Ø®Ø§Ù„Ø¯Ø©."
              : "Trusted clinical solutions for ageless radiance."}
          </p>

          <Link to="/shop">
            <Button
              size="lg"
              className="group w-full bg-burgundy text-white hover:bg-burgundy-dark
                         text-sm uppercase tracking-[0.2em] h-14 font-semibold
                         rounded-none transition-all duration-[400ms] hover:scale-105"
            >
              {isAr ? "ØªØ³ÙˆÙ‚ÙŠ Ø§Ù„Ø¢Ù†" : "Shop Now"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Landscape image */}
        <div className="w-full aspect-[16/9] overflow-hidden">
          <img src={heroDiscovery} alt="Serum discovery" className="w-full h-full object-cover" />
        </div>

        {/* Second video */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/hero-skincare-ritual.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/40 to-transparent z-10" />
    </section>
  );
}
