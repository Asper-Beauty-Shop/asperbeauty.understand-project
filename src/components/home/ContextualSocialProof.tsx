import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Review {
  id: string;
  name: string;
  rating: number;
  excerpt: string;
  productName: string;
  skinType: string;
  ageRange: string;
  concern: string;
  verified: boolean;
}

const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Lana M.",
    rating: 5,
    excerpt:
      "After 3 weeks my barrier feels completely restored. The ceramide concentration is unmatched — no more tightness after cleansing.",
    productName: "Bio-Active Ceramide Serum",
    skinType: "Dry / Dehydrated",
    ageRange: "25–34",
    concern: "Barrier Repair",
    verified: true,
  },
  {
    id: "r2",
    name: "Rami K.",
    rating: 5,
    excerpt:
      "Finally a sunscreen that doesn't leave a white cast on medium skin. Texture is weightless and sits beautifully under makeup.",
    productName: "Mineral UV Shield SPF 50+",
    skinType: "Combination",
    ageRange: "30–39",
    concern: "Sun Protection",
    verified: true,
  },
  {
    id: "r3",
    name: "Nour A.",
    rating: 4,
    excerpt:
      "The niacinamide fluid calmed my hormonal breakouts within 10 days. Pores look visibly smaller. Dr. Sami's recommendation was spot-on.",
    productName: "Niacinamide 10% Clarifying Fluid",
    skinType: "Oily / Acne-Prone",
    ageRange: "18–24",
    concern: "Acne & Pores",
    verified: true,
  },
  {
    id: "r4",
    name: "Hana T.",
    rating: 5,
    excerpt:
      "Ms. Zain helped me build a morning routine that takes 5 minutes. My skin has never looked this luminous — true glass-skin glow.",
    productName: "Hyaluronic Acid Booster",
    skinType: "Normal",
    ageRange: "25–34",
    concern: "Hydration & Glow",
    verified: true,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating
              ? "fill-accent text-accent"
              : "fill-none text-muted-foreground/40"
          }
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2 py-0.5 text-[10px] font-sans font-medium uppercase tracking-wider rounded-full border border-border text-muted-foreground bg-secondary/60">
      {children}
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="group bg-card border border-border p-5 flex flex-col gap-3 transition-shadow duration-500 hover:shadow-maroon-glow">
      {/* Stars + verified */}
      <div className="flex items-center justify-between">
        <StarRating rating={review.rating} />
        {review.verified && (
          <span className="text-[10px] font-sans font-semibold text-primary uppercase tracking-wider">
            Verified Purchase
          </span>
        )}
      </div>

      {/* Quote */}
      <blockquote className="text-sm font-sans text-foreground leading-relaxed line-clamp-4">
        "{review.excerpt}"
      </blockquote>

      {/* Reviewer */}
      <p className="text-xs font-serif text-foreground font-semibold">
        {review.name}
        <span className="font-sans font-normal text-muted-foreground ml-1.5">
          on {review.productName}
        </span>
      </p>

      {/* Context badges */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <Badge>{review.skinType}</Badge>
        <Badge>Age {review.ageRange}</Badge>
        <Badge>{review.concern}</Badge>
      </div>
    </article>
  );
}

export default function ContextualSocialProof() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <section
      className="w-full bg-secondary py-16 px-4 md:px-8"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-12">
          <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-accent mb-2">
            {isAr ? "شهادات حقيقية" : "Real Results"}
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground">
            {isAr
              ? "ماذا يقول عملاؤنا"
              : "What Our Community Says"}
          </h2>
          <p className="mt-3 text-sm font-sans text-muted-foreground max-w-lg mx-auto">
            {isAr
              ? "تقييمات موثقة من عملاء حقيقيين مع بيانات نوع البشرة والاهتمامات"
              : "Verified reviews from real customers — matched to skin type, age, and concern for full transparency."}
          </p>
        </div>

        {/* Review grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
