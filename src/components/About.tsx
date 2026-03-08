import aboutVisual from "@/assets/about-visual.avif";

export const About = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="luxury-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <p className="luxury-subheading text-gold mb-4">Our Philosophy</p>
            <h2
              className="font-display text-4xl md:text-5xl mb-8 leading-tight"
              style={{
                background:
                  "linear-gradient(135deg, hsl(46 100% 45%), hsl(46 100% 60%), hsl(46 100% 45%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Where Science
              <span className="italic block">Meets Soul</span>
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-gold to-gold-light mb-8" />
            <div className="space-y-6 text-charcoal font-body leading-relaxed">
              <p>
                We are not just selling cosmetics; we are dispensing beauty
                through intelligence. Every product at Asper is curated by
                pharmacists who understand the science behind healthy skin.
              </p>
              <p>
                Our clinical-grade approach blends dermatological precision with
                AI-powered recommendations, ensuring each product in your
                regimen is verified for efficacy, authenticity, and safety.
              </p>
              <p>
                Intelligent. Authentic. Eternal. — This is the future of
                dermo-retail, where pharmacist expertise meets cutting-edge
                technology to deliver trusted solutions for ageless radiance.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gold/20">
              <div>
                <p
                  className="font-display text-3xl"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(46 100% 45%), hsl(46 100% 60%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  100%
                </p>
                <p className="luxury-subheading text-charcoal-light mt-1">
                  Authentic
                </p>
              </div>
              <div>
                <p
                  className="font-display text-3xl"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(46 100% 45%), hsl(46 100% 60%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  50+
                </p>
                <p className="luxury-subheading text-charcoal-light mt-1">
                  Brands
                </p>
              </div>
              <div>
                <p
                  className="font-display text-3xl"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(46 100% 45%), hsl(46 100% 60%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  24/7
                </p>
                <p className="luxury-subheading text-charcoal-light mt-1">
                  Support
                </p>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="aspect-[4/5] rounded overflow-hidden">
                <img
                  src={aboutVisual}
                  alt="Luxury beauty products curated by pharmacists"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-gold/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
