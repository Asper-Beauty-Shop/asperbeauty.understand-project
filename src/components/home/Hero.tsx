import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-24 lg:py-32">
      {/* Subtle decorative orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-primary/3 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div>
              <Badge
                variant="outline"
                className="mb-4 border-accent text-accent font-body text-xs tracking-[0.2em] px-4 py-1.5"
              >
                <Shield className="h-3 w-3 mr-2" />
                CLINICAL LUXURY SKINCARE
              </Badge>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight tracking-tight">
                Nature Contained
                <br />
                <span className="text-foreground">by Science.</span>
              </h1>
            </div>

            <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Formulations sealed with the Golden Lotus. We blend potent organic
              botanicals with clinical precision to deliver verifiable radiance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/products">
                <Button
                  size="lg"
                  className="group bg-primary text-primary-foreground hover:bg-primary/90 text-sm uppercase tracking-widest px-8 h-12 shadow-lg shadow-primary/20"
                >
                  Explore The Collection
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-xl lg:translate-x-8 bg-muted">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground font-body text-sm tracking-wider uppercase">
                Hero Image
              </p>
            </div>
            {/* Double-frame border effect */}
            <div className="absolute inset-0 border-[6px] border-card/50 pointer-events-none" />
            <div className="absolute inset-4 border border-accent/30 pointer-events-none rounded-sm" />
          </div>
        </div>
      </div>

      {/* Gold divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
    </section>
  );
}
