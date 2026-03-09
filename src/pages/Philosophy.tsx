import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Award, FlaskConical, Globe, Sparkles } from "lucide-react";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Custom hook for parallax effect
const useParallax = (speed: number = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const distanceFromCenter = elementCenter - windowHeight / 2;
        setOffset(distanceFromCenter * speed);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return { ref, offset };
};

const TimelineSection = ({ isArabic }: { isArabic: boolean }) => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { ref: parallaxRef, offset } = useParallax(0.05);

  const timelineData: { en: TimelineItem[]; ar: TimelineItem[] } = {
    en: [
      {
        year: "2015",
        title: "The Pharmacy Roots",
        description:
          "Asper began as a trusted community pharmacy in Amman, built on the foundation of clinical expertise and genuine care for every customer.",
        icon: <FlaskConical className="w-5 h-5" />,
      },
      {
        year: "2018",
        title: "Dermatology Focus",
        description:
          "We expanded into clinical skincare, partnering with dermatologists to curate medical-grade products that deliver real results.",
        icon: <Sparkles className="w-5 h-5" />,
      },
      {
        year: "2021",
        title: "Digital Evolution",
        description:
          "Asper Beauty was bornâ€”bringing our pharmacy heritage online with a curated selection of luxury skincare and expert guidance.",
        icon: <Globe className="w-5 h-5" />,
      },
      {
        year: "2024",
        title: "Jordan's Premier Destination",
        description:
          "Today, we are recognized as Amman's leading digital beauty concierge, trusted by thousands for authentic, effective products.",
        icon: <Award className="w-5 h-5" />,
      },
    ],
    ar: [
      {
        year: "2015",
        title: "Ø§Ù„Ø¬Ø°ÙˆØ± Ø§Ù„ØµÙŠØ¯Ù„Ø§Ù†ÙŠØ©",
        description:
          "Ø¨Ø¯Ø£Øª Ø¢Ø³Ø¨Ø± ÙƒØµÙŠØ¯Ù„ÙŠØ© Ù…Ø¬ØªÙ…Ø¹ÙŠØ© Ù…ÙˆØ«ÙˆÙ‚Ø© ÙÙŠ Ø¹Ù…Ù‘Ø§Ù†ØŒ Ù…Ø¨Ù†ÙŠØ© Ø¹Ù„Ù‰ Ø£Ø³Ø§Ø³ Ø§Ù„Ø®Ø¨Ø±Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© ÙˆØ§Ù„Ø±Ø¹Ø§ÙŠØ© Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠØ© Ù„ÙƒÙ„ Ø¹Ù…ÙŠÙ„.",
        icon: <FlaskConical className="w-5 h-5" />,
      },
      {
        year: "2018",
        title: "Ø§Ù„ØªØ±ÙƒÙŠØ² Ø¹Ù„Ù‰ Ø·Ø¨ Ø§Ù„Ø¬Ù„Ø¯ÙŠØ©",
        description:
          "ØªÙˆØ³Ø¹Ù†Ø§ ÙÙŠ Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ©ØŒ Ø¨Ø§Ù„Ø´Ø±Ø§ÙƒØ© Ù…Ø¹ Ø£Ø·Ø¨Ø§Ø¡ Ø§Ù„Ø¬Ù„Ø¯ÙŠØ© Ù„Ø§Ø®ØªÙŠØ§Ø± Ù…Ù†ØªØ¬Ø§Øª Ø·Ø¨ÙŠØ© ØªØ­Ù‚Ù‚ Ù†ØªØ§Ø¦Ø¬ Ø­Ù‚ÙŠÙ‚ÙŠØ©.",
        icon: <Sparkles className="w-5 h-5" />,
      },
      {
        year: "2021",
        title: "Ø§Ù„ØªØ·ÙˆØ± Ø§Ù„Ø±Ù‚Ù…ÙŠ",
        description:
          "ÙˆÙ„Ø¯Øª Ø¢Ø³Ø¨Ø± Ø¨ÙŠÙˆØªÙŠâ€”Ù„Ù†Ù‚Ù„ Ø¥Ø±Ø«Ù†Ø§ Ø§Ù„ØµÙŠØ¯Ù„Ø§Ù†ÙŠ Ø¹Ø¨Ø± Ø§Ù„Ø¥Ù†ØªØ±Ù†Øª Ù…Ø¹ Ù…Ø¬Ù…ÙˆØ¹Ø© Ù…Ø®ØªØ§Ø±Ø© Ù…Ù† Ù…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„ÙØ§Ø®Ø±Ø© ÙˆØ¥Ø±Ø´Ø§Ø¯Ø§Øª Ø§Ù„Ø®Ø¨Ø±Ø§Ø¡.",
        icon: <Globe className="w-5 h-5" />,
      },
      {
        year: "2024",
        title: "Ø§Ù„ÙˆØ¬Ù‡Ø© Ø§Ù„Ø£ÙˆÙ„Ù‰ ÙÙŠ Ø§Ù„Ø£Ø±Ø¯Ù†",
        description:
          "Ø§Ù„ÙŠÙˆÙ…ØŒ Ù†Ø­Ù† Ù…Ø¹Ø±ÙˆÙÙˆÙ† ÙƒØ£ÙØ¶Ù„ Ø®Ø¯Ù…Ø© ÙƒÙˆÙ†Ø³ÙŠØ±Ø¬ Ø±Ù‚Ù…ÙŠØ© Ù„Ù„Ø¬Ù…Ø§Ù„ ÙÙŠ Ø¹Ù…Ù‘Ø§Ù†ØŒ Ù…ÙˆØ«ÙˆÙ‚ÙˆÙ† Ù…Ù† Ø§Ù„Ø¢Ù„Ø§Ù Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ù…Ù†ØªØ¬Ø§Øª Ø£ØµÙ„ÙŠØ© ÙˆÙØ¹Ø§Ù„Ø©.",
        icon: <Award className="w-5 h-5" />,
      },
    ],
  };

  const items = timelineData[isArabic ? "ar" : "en"];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleItems((prev) =>
              prev.includes(index) ? prev : [...prev, index]
            );
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -50px 0px" },
    );

    const elements = timelineRef.current?.querySelectorAll("[data-index]");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={parallaxRef}
      className="py-16 md:py-24 bg-burgundy/5 -mx-6 md:-mx-8 px-6 md:px-8 my-16 md:my-24 rounded-lg"
      style={{
        transform: `translateY(${offset}px)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      <div className="text-center mb-12 md:mb-16">
        <span className="font-script text-xl md:text-2xl text-gold mb-3 block">
          {isArabic ? "Ø±Ø­Ù„ØªÙ†Ø§" : "Our Journey"}
        </span>
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-burgundy">
          {isArabic ? "Ù…Ù† Ø§Ù„ØµÙŠØ¯Ù„ÙŠØ© Ø¥Ù„Ù‰ Ø§Ù„ÙØ®Ø§Ù…Ø©" : "From Pharmacy to Luxury"}
        </h2>
      </div>

      <div ref={timelineRef} className="relative">
        {/* Central Line */}
        <div
          className={`absolute ${
            isArabic
              ? "right-6 md:right-1/2 md:translate-x-1/2"
              : "left-6 md:left-1/2 md:-translate-x-1/2"
          } top-0 bottom-0 w-px bg-gold/40`}
        />

        {/* Timeline Items */}
        <div className="space-y-12 md:space-y-0">
          {items.map((item, index) => (
            <div
              key={index}
              data-index={index}
              className={`relative md:flex md:items-center md:justify-center transition-all duration-700 ease-out ${
                visibleItems.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: `${index * 150}ms`,
                transform: visibleItems.includes(index)
                  ? `translateY(${
                    index % 2 === 0 ? offset * 0.3 : offset * -0.3
                  }px)`
                  : undefined,
              }}
            >
              {/* Content Card */}
              <div
                className={`${
                  isArabic ? "mr-12 md:mr-0" : "ml-12 md:ml-0"
                } md:w-5/12 ${
                  index % 2 === 0
                    ? isArabic ? "md:ml-auto md:mr-8" : "md:mr-auto md:ml-8"
                    : isArabic
                    ? "md:mr-auto md:ml-8"
                    : "md:ml-auto md:mr-8"
                } ${index > 0 ? "md:mt-16" : ""}`}
              >
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gold/20 hover:shadow-md hover:border-gold/40 transition-all duration-400">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-display text-2xl md:text-3xl text-gold font-semibold">
                      {item.year}
                    </span>
                  </div>
                  <h3 className="font-display text-lg md:text-xl text-burgundy mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Icon Node */}
              <div
                className={`absolute ${
                  isArabic ? "right-0" : "left-0"
                } md:left-1/2 md:-translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 w-12 h-12 rounded-full bg-gold flex items-center justify-center text-burgundy shadow-lg z-10 transition-transform duration-500 ${
                  visibleItems.includes(index) ? "scale-100" : "scale-0"
                }`}
                style={{ transitionDelay: `${index * 150 + 200}ms` }}
              >
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Parallax section wrapper component
const ParallaxSection = ({
  children,
  speed = 0.08,
  className = "",
  fadeIn = true,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  fadeIn?: boolean;
}) => {
  const { ref, offset } = useParallax(speed);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fadeIn) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [fadeIn]);

  return (
    <div
      ref={(node) => {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        (sectionRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
      }}
      className={`transition-all duration-700 ease-out ${className} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        transform: `translateY(${isVisible ? offset : 32}px)`,
      }}
    >
      {children}
    </div>
  );
};

const Philosophy = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress for decorative elements
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight -
        window.innerHeight;
      const progress = window.scrollY / scrollHeight;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const content = {
    en: {
      pageTitle: "Our Philosophy",
      section1: {
        headline: "Born from Science. Curated for You.",
        body:
          "Asper Beauty is not just a store; it is the digital evolution of our pharmacy heritage. We bridge the gap between clinical dermatology and high-end luxury, ensuring that every product we offer is as effective as it is elegant.",
      },
      section2: {
        headline: "The Art of Selection.",
        body:
          "We reject 90% of the products we review. If a formulation does not meet our strict standards for ingredient purity and performance, it does not make it to our shelves. We navigate the noise of the beauty industry so you don't have to.",
      },
      section3: {
        headline: "Amman's Digital Concierge.",
        body:
          "From the moment you browse to the moment our signature package arrives at your door, you are treated with the care of a private client. Expert advice is just a click away.",
      },
      signature: "The Asper Team",
    },
    ar: {
      pageTitle: "ÙÙ„Ø³ÙØªÙ†Ø§",
      section1: {
        headline: "ÙˆÙ„Ø¯Øª Ù…Ù† Ø§Ù„Ø¹Ù„Ù…. Ù…Ø®ØªØ§Ø±Ø© Ù„ÙƒÙ.",
        body:
          "Ø¢Ø³Ø¨Ø± Ø¨ÙŠÙˆØªÙŠ Ù„ÙŠØ³Øª Ù…Ø¬Ø±Ø¯ Ù…ØªØ¬Ø±Ø› Ø¥Ù†Ù‡Ø§ Ø§Ù„ØªØ·ÙˆØ± Ø§Ù„Ø±Ù‚Ù…ÙŠ Ù„Ø¥Ø±Ø«Ù†Ø§ Ø§Ù„ØµÙŠØ¯Ù„Ø§Ù†ÙŠ. Ù†Ø­Ù† Ù†Ø³Ø¯ Ø§Ù„ÙØ¬ÙˆØ© Ø¨ÙŠÙ† Ø·Ø¨ Ø§Ù„Ø¬Ù„Ø¯ÙŠØ© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ ÙˆØ§Ù„ÙØ®Ø§Ù…Ø© Ø§Ù„Ø±Ø§Ù‚ÙŠØ©ØŒ Ù…Ù…Ø§ ÙŠØ¶Ù…Ù† Ø£Ù† ÙƒÙ„ Ù…Ù†ØªØ¬ Ù†Ù‚Ø¯Ù…Ù‡ ÙØ¹Ø§Ù„ Ø¨Ù‚Ø¯Ø± Ù…Ø§ Ù‡Ùˆ Ø£Ù†ÙŠÙ‚.",
      },
      section2: {
        headline: "ÙÙ† Ø§Ù„Ø§Ø®ØªÙŠØ§Ø±.",
        body:
          "Ù†Ø±ÙØ¶ 90% Ù…Ù† Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„ØªÙŠ Ù†Ø±Ø§Ø¬Ø¹Ù‡Ø§. Ø¥Ø°Ø§ Ù„Ù… ØªØ³ØªÙˆÙÙ Ø§Ù„ØªØ±ÙƒÙŠØ¨Ø© Ù…Ø¹Ø§ÙŠÙŠØ±Ù†Ø§ Ø§Ù„ØµØ§Ø±Ù…Ø© Ù„Ù†Ù‚Ø§Ø¡ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª ÙˆØ§Ù„Ø£Ø¯Ø§Ø¡ØŒ ÙÙ„Ù† ØªØµÙ„ Ø¥Ù„Ù‰ Ø±ÙÙˆÙÙ†Ø§. Ù†Ø­Ù† Ù†Ù†Ù‚Ø°Ùƒ Ù…Ù† Ø¶Ø¬ÙŠØ¬ ØµÙ†Ø§Ø¹Ø© Ø§Ù„Ø¬Ù…Ø§Ù„ Ø­ØªÙ‰ Ù„Ø§ ØªØ¶Ø·Ø±ÙŠ Ù„Ù„ØªØ¹Ø§Ù…Ù„ Ù…Ø¹Ù‡.",
      },
      section3: {
        headline: "Ø§Ù„ÙƒÙˆÙ†Ø³ÙŠØ±Ø¬ Ø§Ù„Ø±Ù‚Ù…ÙŠ ÙÙŠ Ø¹Ù…Ù‘Ø§Ù†.",
        body:
          "Ù…Ù† Ù„Ø­Ø¸Ø© ØªØµÙØ­Ùƒ Ø¥Ù„Ù‰ Ù„Ø­Ø¸Ø© ÙˆØµÙˆÙ„ Ø·Ø±Ø¯Ù†Ø§ Ø§Ù„Ù…Ù…ÙŠØ² Ø¥Ù„Ù‰ Ø¨Ø§Ø¨ÙƒØŒ ÙŠØªÙ… Ø§Ù„ØªØ¹Ø§Ù…Ù„ Ù…Ø¹Ùƒ Ø¨Ø¹Ù†Ø§ÙŠØ© Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø§Ù„Ø®Ø§Øµ. Ø§Ù„Ù†ØµÙŠØ­Ø© Ø§Ù„Ø®Ø¨ÙŠØ±Ø© Ø¹Ù„Ù‰ Ø¨Ø¹Ø¯ Ù†Ù‚Ø±Ø© ÙˆØ§Ø­Ø¯Ø©.",
      },
      signature: "ÙØ±ÙŠÙ‚ Ø¢Ø³Ø¨Ø±",
    },
  };

  const t = content[language];

  return (
    <div
      className="min-h-screen bg-cream overflow-hidden"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Header />

      {/* Decorative floating elements with parallax */}
      <div
        className="fixed top-1/4 left-8 w-32 h-32 rounded-full bg-gold/5 blur-3xl pointer-events-none"
        style={{
          transform: `translateY(${scrollProgress * -100}px)`,
        }}
      />
      <div
        className="fixed bottom-1/4 right-8 w-48 h-48 rounded-full bg-burgundy/5 blur-3xl pointer-events-none"
        style={{
          transform: `translateY(${scrollProgress * 150}px)`,
        }}
      />

      {/* Main Content - Editorial Style */}
      <main className="pt-40 md:pt-48 pb-24 relative">
        {/* Narrow Content Column */}
        <article className="max-w-[800px] mx-auto px-6 md:px-8">
          {/* Page Title with enhanced parallax */}
          <ParallaxSection speed={0.12} className="text-center mb-16 md:mb-24">
            <header>
              <span
                className="font-script text-2xl md:text-3xl text-gold mb-4 block"
                style={{
                  transform: `translateY(${scrollProgress * -20}px)`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                {isArabic ? "Ù‚ØµØªÙ†Ø§" : "Our Story"}
              </span>
              <h1
                className="font-display text-4xl md:text-5xl lg:text-6xl text-burgundy leading-tight"
                style={{
                  transform: `translateY(${scrollProgress * -40}px) scale(${
                    1 - scrollProgress * 0.05
                  })`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                {t.pageTitle}
              </h1>
            </header>
          </ParallaxSection>

          {/* Section 1: The Origin */}
          <ParallaxSection speed={0.06} className="mb-16 md:mb-24">
            <section>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-burgundy mb-6 leading-snug">
                {t.section1.headline}
              </h2>
              <p className="font-body text-base md:text-lg text-foreground leading-relaxed">
                {t.section1.body}
              </p>

              {/* Gold Line Separator with animation */}
              <div className="flex justify-center my-12 md:my-16">
                <div
                  className="h-px bg-gold transition-all duration-700"
                  style={{
                    width: `${Math.min(96, 24 + scrollProgress * 200)}px`,
                  }}
                />
              </div>
            </section>
          </ParallaxSection>

          {/* Animated Timeline */}
          <TimelineSection isArabic={isArabic} />

          {/* Section 2: The Rejection Policy */}
          <ParallaxSection speed={0.04} className="mb-16 md:mb-24">
            <section>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-burgundy mb-6 leading-snug">
                {t.section2.headline}
              </h2>
              <p className="font-body text-base md:text-lg text-foreground leading-relaxed">
                {t.section2.body}
              </p>

              {/* Gold Line Separator */}
              <div className="flex justify-center my-12 md:my-16">
                <div
                  className="h-px bg-gold transition-all duration-700"
                  style={{
                    width: `${Math.min(96, 24 + scrollProgress * 150)}px`,
                  }}
                />
              </div>
            </section>
          </ParallaxSection>

          {/* Section 3: The Service Promise */}
          <ParallaxSection speed={0.03} className="mb-16 md:mb-24">
            <section>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-burgundy mb-6 leading-snug">
                {t.section3.headline}
              </h2>
              <p className="font-body text-base md:text-lg text-foreground leading-relaxed">
                {t.section3.body}
              </p>
            </section>
          </ParallaxSection>

          {/* The Signature with floating effect */}
          <ParallaxSection
            speed={0.02}
            className="pt-8 md:pt-12 border-t border-gold/30"
          >
            <footer className="text-center">
              <span
                className="font-script text-3xl md:text-4xl text-gold inline-block"
                style={{
                  transform: `translateY(${
                    Math.sin(scrollProgress * Math.PI * 2) * 5
                  }px)`,
                  transition: "transform 0.2s ease-out",
                }}
              >
                {t.signature}
              </span>

              {/* Decorative star */}
              <div
                className="mt-8 w-12 h-12 mx-auto opacity-30"
                style={{
                  transform: `rotate(${scrollProgress * 180}deg)`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full text-gold">
                  <path
                    d="M50 5 L58 38 L95 38 L65 58 L73 95 L50 73 L27 95 L35 58 L5 38 L42 38 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </footer>
          </ParallaxSection>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default Philosophy;
