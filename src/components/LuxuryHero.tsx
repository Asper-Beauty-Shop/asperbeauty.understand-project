import React from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
export const LuxuryHero = () => {
  const scrollToCollection = () => {
    const element = document.getElementById("featured-collection");
    element?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <div className="relative h-screen w-full overflow-hidden bg-luxury-black">
      {/* 1. Background Image with "Ken Burns" Slow Zoom Effect */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
          style={{
            backgroundImage: `url('/luxury-beauty-background.jpg')`,
          }}
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/60 to-transparent" />
      </div>

      {/* 2. Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-rose-50">
        {/* Gold Pre-heading (The "Eyebrow") */}
        <span className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.3em] text-gold-300 animate-fade-in-up opacity-0 [animation-delay:0.2s] text-rose-800">
          The New Collection
        </span>

        {/* Main Headline - Playfair Display */}
        <h1 className="font-serif text-5xl font-light leading-tight tracking-tight text-soft-ivory md:text-7xl lg:text-8xl animate-fade-in-up opacity-0 [animation-delay:0.4s]">
          Redefining{" "}
          <span className="block italic text-gold-300">
            Eternal Beauty
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-lg font-sans text-base font-light leading-relaxed text-soft-ivory/70 md:text-lg animate-fade-in-up opacity-0 [animation-delay:0.6s]">
          Experience the fusion of nature's finest ingredients and scientific
          innovation. A ritual designed for those who demand perfection.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row animate-fade-in-up opacity-0 [animation-delay:0.8s] text-rose-800 bg-transparent">
          {/* Primary CTA - Gold */}
          <Button
            asChild
            className="group bg-gold-300 px-8 py-6 font-sans text-sm font-medium uppercase tracking-widest text-luxury-black transition-all duration-300 hover:bg-gold-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            <Link to="/shop">
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 text-rose-800" />
            </Link>
          </Button>

          {/* Secondary CTA - Glass/Outline */}
          <Button
            variant="outline"
            className="border-soft-ivory/30 bg-soft-ivory/5 px-8 py-6 font-sans text-sm font-medium uppercase tracking-widest text-soft-ivory backdrop-blur-sm transition-all duration-300 hover:border-gold-300 hover:bg-soft-ivory/10 hover:text-gold-300"
          >
            View Lookbook
          </Button>
        </div>
      </div>

      {/* 3. Scroll Indicator */}
      <button
        onClick={scrollToCollection}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-soft-ivory/50 transition-colors duration-300 hover:text-gold-300 animate-fade-in-up opacity-0 [animation-delay:1s]"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-sans text-xs uppercase tracking-widest">
            Scroll
          </span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </button>
    </div>
  );
};
export default LuxuryHero;
