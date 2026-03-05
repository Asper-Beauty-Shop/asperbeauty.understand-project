import { Quote, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "./AnimatedSection";
import { LazyImage } from "./LazyImage";

const testimonials = [
  {
    id: 1,
    name: "Rania Al-Majali",
    nameAr: "رانيا المجالي",
    location: "Amman, Jordan",
    locationAr: "عمّان، الأردن",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review:
      "Absolutely love the Vichy products I ordered. The packaging was luxurious and arrived quickly. Asper has become my go-to for all skincare needs!",
    reviewAr:
      "منتجات رائعة وأصلية ١٠٠٪. طلبت من آسبر أكثر من مرة والتوصيل سريع جداً على عمّان. أنصح الكل فيهم!",
  },
  {
    id: 2,
    name: "Dana Al-Zoubi",
    nameAr: "دانا الزعبي",
    location: "Irbid, Jordan",
    locationAr: "إربد، الأردن",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review:
      "The customer service is exceptional. They helped me find the perfect anti-aging routine. My skin has never looked better!",
    reviewAr:
      "خدمة العملاء ممتازة والردود سريعة. ساعدوني أختار المنتجات المناسبة لبشرتي. شكراً آسبر!",
  },
  {
    id: 3,
    name: "Lina Haddad",
    nameAr: "لينا حداد",
    location: "Aqaba, Jordan",
    locationAr: "العقبة، الأردن",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review:
      "Finally, a beauty store that understands luxury. The selection of fragrances is unmatched. Every purchase feels like a special occasion.",
    reviewAr:
      "أخيراً لقيت متجر يوفر منتجات العناية الأصلية بالأردن. الأسعار منافسة والجودة عالية. ما رح أشتري من غيرهم!",
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-all duration-300 ${
          i < rating
            ? "fill-polished-gold text-polished-gold drop-shadow-[0_0_4px_rgba(201,169,98,0.5)]"
            : "text-polished-gold/30"
        }`}
      />
    ))}
  </div>
);

export const Testimonials = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className="py-20 lg:py-28 bg-asper-stone overflow-hidden relative">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/40 to-transparent" />

      <div className="luxury-container">
        {/* Section Header */}
        <AnimatedSection
          className="text-center mb-16"
          animation="slide-up"
          duration={800}
        >
          {/* Icon Badge */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-polished-gold/20 via-polished-gold/10 to-transparent border-2 border-polished-gold/30 mb-6 shadow-[0_4px_20px_rgba(201,169,98,0.2)]">
            <Quote className="w-6 h-6 text-polished-gold" />
          </div>
          <p className="font-body text-xs uppercase tracking-[0.25em] text-rose-clay-dark mb-3">
            {isArabic ? "ماذا يقول عملاؤنا" : "What Our Clients Say"}
          </p>
          <h2 className="font-display text-3xl lg:text-4xl text-asper-ink mb-4">
            {isArabic ? "شهادات العملاء" : "Testimonials"}
          </h2>
          {/* Gold Divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-polished-gold/60" />
            <div className="w-2 h-2 rounded-full bg-polished-gold/60 shadow-[0_0_10px_rgba(201,169,98,0.4)]" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-polished-gold/60" />
          </div>
        </AnimatedSection>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection
              key={testimonial.id}
              animation="zoom"
              delay={index * 200}
              duration={800}
            >
              <div className="relative bg-white/70 backdrop-blur-sm border border-rose-clay-light rounded-xl p-8 transition-all duration-500 hover:border-polished-gold/50 hover:shadow-[0_8px_30px_rgba(201,169,98,0.15)] group h-full overflow-hidden">
                {/* Shine effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-polished-gold/5 to-transparent" />

                {/* Quote Icon */}
                <div className="relative mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-polished-gold/15 via-polished-gold/10 to-transparent border border-polished-gold/25 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(201,169,98,0.2)] transition-shadow duration-500">
                    <Quote className="w-5 h-5 text-polished-gold" />
                  </div>
                </div>

                {/* Review Text */}
                <p className="relative font-body text-asper-ink/80 leading-relaxed mb-6 min-h-[100px]">
                  {isArabic ? testimonial.reviewAr : testimonial.review}
                </p>

                {/* Rating */}
                <div className="relative mb-6">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Divider */}
                <div className="relative w-full h-px bg-gradient-to-r from-transparent via-rose-clay-light to-transparent mb-6" />

                {/* Author Info */}
                <div className="relative flex items-center gap-4">
                  {/* Avatar with rose-clay ring */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-polished-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md scale-110" />
                    <div className="relative w-14 h-14 rounded-full border-2 border-rose-clay-light overflow-hidden group-hover:border-polished-gold/60 shadow-[0_2px_10px_rgba(196,164,148,0.2)] group-hover:shadow-[0_4px_20px_rgba(201,169,98,0.3)] transition-all duration-500">
                      <LazyImage
                        src={testimonial.avatar}
                        alt={isArabic ? testimonial.nameAr : testimonial.name}
                        className="w-full h-full object-cover"
                        skeletonClassName="rounded-full"
                      />
                    </div>
                  </div>

                  {/* Name & Location */}
                  <div>
                    <h4 className="font-display text-base text-burgundy group-hover:text-polished-gold transition-colors duration-500">
                      {isArabic ? testimonial.nameAr : testimonial.name}
                    </h4>
                    <p className="font-body text-xs text-rose-clay-dark/70">
                      {isArabic ? testimonial.locationAr : testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Bottom Accent */}
        <AnimatedSection
          animation="blur"
          delay={700}
          duration={1000}
          className="flex flex-col items-center mt-16"
        >
          <div className="flex items-center gap-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-polished-gold/60" />
            <span className="font-body text-sm italic text-rose-clay-dark">
              {isArabic ? "الأناقة في كل تفصيل" : "Elegance in every detail"}
            </span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-polished-gold/60" />
          </div>
        </AnimatedSection>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-polished-gold/40 to-transparent" />
    </section>
  );
};
