import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  IconAcne,
  IconHydration,
  IconAntiAging,
  IconSensitivity,
  IconPigmentation,
  IconRedness,
  IconSunProtection,
} from "@/components/brand/ClinicalIcons";

const concerns = [
  { label: "Acne", Icon: IconAcne, query: "acne" },
  { label: "Hydration", Icon: IconHydration, query: "hydration" },
  { label: "Anti-Aging", Icon: IconAntiAging, query: "aging" },
  { label: "Sensitivity", Icon: IconSensitivity, query: "sensitivity" },
  { label: "Pigmentation", Icon: IconPigmentation, query: "pigmentation" },
  { label: "Redness", Icon: IconRedness, query: "redness" },
  { label: "Sun Protection", Icon: IconSunProtection, query: "SPF sunscreen" },
];

export default function ShopByConcern() {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Badge
            variant="outline"
            className="mb-4 border-accent text-accent font-body text-xs tracking-[0.2em] px-4 py-1.5"
          >
            GUIDED DISCOVERY
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Shop by <span className="text-primary">Concern</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Tell us what bothers you — we'll show you what works.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {concerns.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Link
                to={`/products?q=${encodeURIComponent(c.query)}`}
                className="group flex flex-col items-center gap-3 p-4 sm:p-6 h-full rounded-xl border border-border bg-card hover:border-accent/50 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] transition-all duration-300 active:scale-95"
              >
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors shadow-inner">
                  <c.Icon
                    size={26}
                    className="text-primary group-hover:text-accent transition-colors duration-300"
                  />
                </div>
                <span className="font-body text-xs sm:text-sm font-medium text-foreground text-center tracking-wide">
                  {c.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

