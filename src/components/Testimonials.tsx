import { Quote, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "./AnimatedSection";
import { LazyImage } from "./LazyImage";

const testimonials = [
  {
    id: 1,
    name: "Rania Al-Majali",
    nameAr: "Ø±Ø§Ù†ÙŠØ§ Ø§Ù„Ù…Ø¬Ø§Ù„ÙŠ",
    location: "Amman, Jordan",
    locationAr: "Ø¹Ù…Ù‘Ø§Ù†ØŒ Ø§Ù„Ø£Ø±Ø¯Ù†",
    avatar:
      "/assets/luxury-asset-4.png",
    rating: 5,
    review:
      "Absolutely love the Vichy products I ordered. The packaging was luxurious and arrived quickly. Asper has become my go-to for all skincare needs!",
    reviewAr:
      "Ù…Ù†ØªØ¬Ø§Øª Ø±Ø§Ø¦Ø¹Ø© ÙˆØ£ØµÙ„ÙŠØ© Ù¡Ù Ù Ùª. Ø·Ù„Ø¨Øª Ù…Ù† Ø¢Ø³Ø¨Ø± Ø£ÙƒØ«Ø± Ù…Ù† Ù…Ø±Ø© ÙˆØ§Ù„ØªÙˆØµÙŠÙ„ Ø³Ø±ÙŠØ¹ Ø¬Ø¯Ø§Ù‹ Ø¹Ù„Ù‰ Ø¹Ù…Ù‘Ø§Ù†. Ø£Ù†ØµØ­ Ø§Ù„ÙƒÙ„ ÙÙŠÙ‡Ù…!",
  },
  {
    id: 2,
    name: "Dana Al-Zoubi",
    nameAr: "Ø¯Ø§Ù†Ø§ Ø§Ù„Ø²Ø¹Ø¨ÙŠ",
    location: "Irbid, Jordan",
    locationAr: "Ø¥Ø±Ø¨Ø¯ØŒ Ø§Ù„Ø£Ø±Ø¯Ù†",
    avatar:
      "/assets/luxury-asset-5.png",
    rating: 5,
    review:
      "The customer service is exceptional. They helped me find the perfect anti-aging routine. My skin has never looked better!",
    reviewAr:
      "Ø®Ø¯Ù…Ø© Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ù…Ù…ØªØ§Ø²Ø© ÙˆØ§Ù„Ø±Ø¯ÙˆØ¯ Ø³Ø±ÙŠØ¹Ø©. Ø³Ø§Ø¹Ø¯ÙˆÙ†ÙŠ Ø£Ø®ØªØ§Ø± Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø© Ù„Ø¨Ø´Ø±ØªÙŠ. Ø´ÙƒØ±Ø§Ù‹ Ø¢Ø³Ø¨Ø±!",
  },
  {
    id: 3,
    name: "Lina Haddad",
    nameAr: "Ù„ÙŠÙ†Ø§ Ø­Ø¯Ø§Ø¯",
    location: "Aqaba, Jordan",
    locationAr: "Ø§Ù„Ø¹Ù‚Ø¨Ø©ØŒ Ø§Ù„Ø£Ø±Ø¯Ù†",
    avatar:
      "/assets/luxury-asset-6.png",
    rating: 5,
    review:
      "Finally, a beauty store that understands luxury. The selection of fragrances is unmatched. Every purchase feels like a special occasion.",
    reviewAr:
      "Ø£Ø®ÙŠØ±Ø§Ù‹ Ù„Ù‚ÙŠØª Ù…ØªØ¬Ø± ÙŠÙˆÙØ± Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„Ø£ØµÙ„ÙŠØ© Ø¨Ø§Ù„Ø£Ø±Ø¯Ù†. Ø§Ù„Ø£Ø³Ø¹Ø§Ø± Ù…Ù†Ø§ÙØ³Ø© ÙˆØ§Ù„Ø¬ÙˆØ¯Ø© Ø¹Ø§Ù„ÙŠØ©. Ù…Ø§ Ø±Ø­ Ø£Ø´ØªØ±ÙŠ Ù…Ù† ØºÙŠØ±Ù‡Ù…!",
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
            {isArabic ? "Ù…Ø§Ø°Ø§ ÙŠÙ‚ÙˆÙ„ Ø¹Ù…Ù„Ø§Ø¤Ù†Ø§" : "What Our Clients Say"}
          </p>
          <h2 className="font-display text-3xl lg:text-4xl text-asper-ink mb-4">
            {isArabic ? "Ø´Ù‡Ø§Ø¯Ø§Øª Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡" : "Testimonials"}
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
              {isArabic ? "Ø§Ù„Ø£Ù†Ø§Ù‚Ø© ÙÙŠ ÙƒÙ„ ØªÙØµÙŠÙ„" : "Elegance in every detail"}
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

