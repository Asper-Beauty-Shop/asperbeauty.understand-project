import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Instagram } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const InstagramFeed = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const { ref: sectionRef, isVisible } = useScrollAnimation({
    threshold: 0.15,
  });

  const instagramPosts = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
      likes: 342,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop",
      likes: 287,
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
      likes: 456,
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop",
      likes: 198,
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=400&fit=crop",
      likes: 523,
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop",
      likes: 389,
    },
  ];

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-16 bg-cream overflow-hidden"
    >
      <div className="luxury-container">
        {/* Header with animation */}
        <div
          className={`text-center mb-10 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="luxury-heading text-3xl md:text-4xl mb-3">
            {isArabic ? "تابعنا على انستغرام" : "Follow Us on Instagram"}
          </h2>
          <a
            href="https://www.instagram.com/asper.beauty.shop/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium group"
          >
            <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            @asper.beauty.shop
          </a>
        </div>

        {/* Grid with staggered animations */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {instagramPosts.map((post, index) => (
            <a
              key={post.id}
              href="https://www.instagram.com/asper.beauty.shop/"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-2xl 
                transition-all duration-500 ease-out
                ${
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-12 scale-95"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100 + 200}ms` : "0ms",
              }}
            >
              {/* Image with filters */}
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-full object-cover transition-all duration-700 ease-out 
                  group-hover:scale-125 group-hover:rotate-2
                  filter saturate-100 group-hover:saturate-[1.2] group-hover:brightness-90"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent 
                opacity-0 group-hover:opacity-100 transition-all duration-500" />

              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                bg-gradient-to-r from-transparent via-white/20 to-transparent
                -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                {/* Instagram icon with animation */}
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 
                  transition-all duration-500 ease-out">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center
                    border border-white/30 mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Likes with heart animation */}
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 
                  transition-all duration-500 delay-100 ease-out flex items-center gap-2 text-white">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500 group-hover:animate-pulse" />
                  <span className="font-display text-lg">{post.likes}</span>
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-gold/40 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Border glow effect */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent 
                group-hover:border-gold/50 transition-colors duration-500" />
            </a>
          ))}
        </div>

        {/* CTA Button with animation */}
        <div
          className={`text-center mt-10 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: isVisible ? "800ms" : "0ms" }}
        >
          <a
            href="https://www.instagram.com/asper.beauty.shop/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 
              text-white font-display text-sm tracking-widest uppercase rounded-full
              shadow-lg hover:shadow-xl hover:shadow-pink-500/25 
              transform hover:-translate-y-1 transition-all duration-400"
          >
            <Instagram className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            {isArabic ? "تابعنا على انستغرام" : "Follow on Instagram"}
          </a>
        </div>
      </div>
    </section>
  );
};
