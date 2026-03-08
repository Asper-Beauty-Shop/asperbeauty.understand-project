import { Star, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Review {
  id: number;
  author: string;
  title: string;
  content: string;
  skinType: string;
  primaryConcern: string;
  age: string;
  verified: boolean;
  rating: number;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    author: "Sarah M.",
    title: "Completely repaired my barrier.",
    content:
      "After weeks of redness and stinging from over-exfoliation, this moisturizer was a lifesaver. It feels incredibly rich but sinks in beautifully. The 'Morning Spa' glow is real.",
    skinType: "Dry / Sensitive",
    primaryConcern: "Compromised Barrier",
    age: "30s",
    verified: true,
    rating: 5,
  },
  {
    id: 2,
    author: "Elena R.",
    title: "Holy grail for hyperpigmentation.",
    content:
      "I consulted with Dr. Sami on the site and he recommended this specific Vitamin C. Three weeks later, my acne scars are visibly lighter. No irritation at all.",
    skinType: "Combination / Acne-Prone",
    primaryConcern: "Post-Blemish Marks",
    age: "20s",
    verified: true,
    rating: 5,
  },
  {
    id: 3,
    author: "Aisha K.",
    title: "Flawless, luminous finish.",
    content:
      "Ms. Zain matched my shade perfectly. It provides just enough coverage to hide my redness while looking completely natural. A true luxury texture.",
    skinType: "Normal / Rosacea",
    primaryConcern: "Uneven Tone",
    age: "40s",
    verified: true,
    rating: 5,
  },
];

function ContextTag({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-block px-2.5 py-1 bg-card border border-border text-muted-foreground text-xs font-body tracking-wide">
      {label}: <span className="font-semibold text-foreground">{value}</span>
    </span>
  );
}

export default function ContextualSocialProof() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <section
      className="w-full bg-card py-24 px-4 md:px-8 border-t border-border"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
            {isAr
              ? "نتائج سريرية. روتين حقيقي."
              : "Clinical Results. Real Routines."}
          </h2>
          <p className="text-muted-foreground font-body text-lg font-light max-w-2xl mx-auto">
            {isAr
              ? "اكتشفي كيف تعمل تركيباتنا المختارة عبر مختلف أنواع البشرة والأهداف الجمالية."
              : "Discover how our curated formulations perform across different skin profiles and aesthetic goals."}
          </p>
        </div>

        {/* Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <article
              key={review.id}
              className="bg-background border border-border p-8 flex flex-col transition-all duration-[500ms] ease-[cubic-bezier(0.19,1,0.22,1)] hover:shadow-maroon-glow hover:-translate-y-1"
            >
              {/* Stars & Verification */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-1 text-accent">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                {review.verified && (
                  <span className="flex items-center gap-1 text-xs font-body font-semibold text-primary uppercase tracking-wider">
                    <CheckCircle2 size={14} />
                    {isAr ? "مشتري موثق" : "Verified Buyer"}
                  </span>
                )}
              </div>

              {/* Review Content */}
              <h3 className="font-display text-lg text-foreground mb-3 leading-tight font-semibold">
                "{review.title}"
              </h3>
              <p className="font-sans text-muted-foreground text-sm leading-relaxed mb-8 flex-grow">
                {review.content}
              </p>

              {/* Clinical Context Footer */}
              <div className="mt-auto pt-5 border-t border-foreground/10">
                <p className="font-sans text-sm font-semibold text-foreground mb-3">
                  {review.author}
                </p>
                <div className="flex flex-wrap gap-2">
                  <ContextTag
                    label={isAr ? "النوع" : "Type"}
                    value={review.skinType}
                  />
                  <ContextTag
                    label={isAr ? "الهدف" : "Goal"}
                    value={review.primaryConcern}
                  />
                  <ContextTag
                    label={isAr ? "العمر" : "Age"}
                    value={review.age}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

