import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconSkincare,
  IconHairCare,
  IconSupplements,
  IconBodyBath,
  IconToolsDevices,
  IconSunProtection,
  IconEzabila,
} from "@/components/brand/ClinicalIcons";

const concerns = [
  { label: "Acne & Breakouts", slug: "Concern_Acne" },
  { label: "Hydration & Dryness", slug: "Concern_Hydration" },
  { label: "Anti-Aging", slug: "Concern_Aging" },
  { label: "Sensitivity", slug: "Concern_Sensitivity" },
  { label: "Pigmentation", slug: "Concern_Pigmentation" },
  { label: "Redness", slug: "Concern_Redness" },
  { label: "Oiliness", slug: "Concern_Oiliness" },
];

const categories = [
  { label: "Skincare", slug: "skincare", Icon: IconSkincare },
  { label: "Hair Care", slug: "hair", Icon: IconHairCare },
  { label: "Supplements", slug: "supplement", Icon: IconSupplements },
  { label: "Body & Bath", slug: "body", Icon: IconBodyBath },
  { label: "Tools & Devices", slug: "devices", Icon: IconToolsDevices },
  { label: "Sun Protection", slug: "sunscreen", Icon: IconSunProtection },
];

interface Props {
  label: string;
}

export default function MegaMenu({ label }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
        {label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[680px] bg-card border border-border rounded-lg shadow-xl z-50 p-6"
          >
            <div className="grid grid-cols-3 gap-8">
              {/* Categories Column — with Clinical Icons */}
              <div>
                <p className="text-xs font-body font-semibold uppercase tracking-[0.15em] text-primary mb-4">
                  Departments
                </p>
                <div className="space-y-1">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/products?category=${c.slug}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent/10 transition-colors text-sm font-body text-foreground/80"
                    >
                      <c.Icon
                        size={18}
                        className="text-primary group-hover:text-accent transition-colors duration-300"
                      />
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Concerns Column */}
              <div>
                <p className="text-xs font-body font-semibold uppercase tracking-[0.15em] text-primary mb-4">
                  What's your concern?
                </p>
                <div className="space-y-1">
                  {concerns.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/products?concern=${c.slug}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary transition-colors text-sm font-body text-foreground/80"
                    >
                      <span className="w-0.5 h-4 rounded-full bg-transparent group-hover:bg-accent transition-colors" />
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Featured Column */}
              <div className="bg-secondary/50 rounded-lg p-4 border border-border/30">
                <div className="flex items-center gap-1.5 mb-3">
                  <IconEzabila size={14} className="text-accent" />
                  <p className="text-xs font-body font-semibold uppercase tracking-[0.15em] text-accent">
                    Ms. Zain's Pick
                  </p>
                </div>
                <p className="text-sm font-body text-muted-foreground leading-relaxed mb-4">
                  "This month I'm obsessed with hydrating serums that layer beautifully under SPF."
                </p>
                <Link
                  to="/products"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center text-xs font-body font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Browse All Products →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
