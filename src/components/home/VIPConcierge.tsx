import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Sparkles, Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Truck,
    title: "Amman Concierge Delivery",
    description: "Same-day, temperature-controlled delivery across Amman. Your regimen arrives in pristine clinical condition — cold-chain sealed from our pharmacy to your doorstep.",
    badge: "FREE OVER 50 JOD",
  },
  {
    icon: Sparkles,
    title: "AI Beauty Advisor",
    description: "Upload a photo and receive a pharmacist-grade skin assessment powered by Gemini Vision. Personalized routines crafted by our dual-persona AI — Dr. Sami for clinical needs, Ms. Zain for beauty goals.",
    badge: "AI-POWERED",
  },
  {
    icon: Crown,
    title: "The Elite Subscription",
    description: "Never run out of your routine. Our Smart Shelf tracks your usage and sends a gentle reminder before you're due — ensuring uninterrupted clinical care with exclusive VIP pricing.",
    badge: "VIP PERKS",
  },
];

const VIPConcierge = () => {
  return (
    <section
      className="py-16 sm:py-20"
      style={{
        background: "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(60 100% 97%) 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4 border-accent text-accent font-body text-xs tracking-[0.2em] px-4 py-1.5">
            <Crown className="h-3 w-3 me-1.5 inline" />
            VIP CONCIERGE SERVICES
          </Badge>
          <h2 className="font-arabic text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            Luxury That <span className="text-primary">Comes to You</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Premium services designed for those who expect pharmacy-grade precision with five-star convenience.
          </p>
        </div>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {services.map((service, i) => (
            <Card
              key={i}
              className="group bg-white border-border/40 hover:border-accent/40 transition-all duration-[400ms] ease-luxury shadow-md hover:shadow-xl overflow-hidden"
            >
              <CardContent className="p-8 flex flex-col h-full">
                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/15 transition-colors duration-[400ms]">
                  <service.icon className="h-6 w-6 text-accent" />
                </div>

                {/* Badge */}
                <Badge variant="secondary" className="w-fit mb-4 text-[10px] tracking-[0.15em] font-body">
                  {service.badge}
                </Badge>

                {/* Text */}
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed flex-1">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/intelligence">
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white font-body tracking-wider group">
              Experience the Concierge
              <ArrowRight className="h-4 w-4 ms-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VIPConcierge;
