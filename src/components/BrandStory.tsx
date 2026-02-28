import { useLanguage } from "@/contexts/LanguageContext";
import asperLogo from "@/assets/asper-lotus-logo-optimized.webp";

const features = {
  en: [
    "100% Organic Botanicals",
    "Cruelty-Free & Ethical",
    "Dermatologist Tested",
  ],
  ar: ["مكونات عضوية 100%", "خالٍ من القسوة وأخلاقي", "مُختبر من أطباء الجلدية"],
};

const BrandStory = () => {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const featureList = features[language];

  return (
    <section className="py-24 bg-asper-merlot relative overflow-hidden">
      {/* Decorative Gold Border Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-transparent to-asper-gold opacity-50" />

      <div
        className={`container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center ${
          isRTL ? "md:grid-flow-dense" : ""
        }`}
      >
        {/* Left: Text */}
        <div
          className={`space-y-8 ${
            isRTL ? "text-right md:order-2" : "text-left"
          }`}
        >
          <h2 className="font-serif text-4xl md:text-6xl text-asper-gold leading-tight">
            {isRTL
              ? (
                <>
                  فن <br />
                  <span className="italic text-white opacity-90">
                    الطقوس السماوية
                  </span>
                </>
              )
              : (
                <>
                  The Art of <br />
                  <span className="italic text-white opacity-90">
                    Celestial Rituals
                  </span>
                </>
              )}
          </h2>

          <p className="text-asper-ivory/80 leading-loose font-light text-lg">
            {isRTL
              ? "في أسبر بيوتي، نؤمن بأن الجمال طقس وليس روتين. مستوحاة من صمود زهرة اللوتس وأناقة الذهب الخالدة، أنشأنا ملاذاً لبشرتك."
              : "At Asper Beauty, we believe beauty is a ritual, not a routine. Inspired by the resilience of the lotus and the timeless elegance of gold, we created a sanctuary for your skin."}
          </p>

          <div className="space-y-4">
            {featureList.map((item) => (
              <div
                key={item}
                className={`flex items-center gap-4 text-asper-goldLight ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <span className="h-[1px] w-8 bg-asper-gold" />
                <span className="uppercase tracking-widest text-sm">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image with Rotating Border */}
        <div className={`relative ${isRTL ? "md:order-1" : ""}`}>
          {/* Rotating Gold Ring */}
          <div className="absolute -inset-4 border border-asper-gold/20 rounded-full animate-spin-slow" />

          {/* Main Image */}
          <img
            src={asperLogo}
            alt={isRTL ? "طقوس أسبر" : "Asper Ritual"}
            className="rounded-t-full border-b-4 border-asper-gold shadow-2xl mx-auto max-w-sm w-full object-cover"
          />
        </div>
      </div>

      {/* Bottom Gold Line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-t from-transparent to-asper-gold opacity-50" />
    </section>
  );
};

export default BrandStory;
