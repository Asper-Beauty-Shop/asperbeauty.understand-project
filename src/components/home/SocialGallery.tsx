import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Instagram, Facebook, ExternalLink, ArrowRight } from "lucide-react";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { BlurUpImage } from "@/components/BlurUpImage";
import { Link } from "react-router-dom";

const socialPosts = [
  {
    id: 1,
    platform: "instagram" as const,
    caption: "Morning glow routine with La Roche-Posay 🌅",
    hashtag: "#AsperGlow",
    link: "https://www.instagram.com/asper.beauty.shop/",
  },
  {
    id: 2,
    platform: "facebook" as const,
    caption: "Pharmacist-approved sunscreen picks for summer ☀️",
    hashtag: "#SanctuaryOfScience",
    link: "https://www.facebook.com/robu.sweileh",
  },
  {
    id: 3,
    platform: "instagram" as const,
    caption: "Hydration heroes: CeraVe vs Vichy deep dive 💧",
    hashtag: "#AsperReviews",
    link: "https://www.instagram.com/asper.beauty.shop/",
  },
  {
    id: 4,
    platform: "facebook" as const,
    caption: "Pregnancy-safe skincare essentials 🤰",
    hashtag: "#SafeBeauty",
    link: "https://www.facebook.com/robu.sweileh",
  },
  {
    id: 5,
    platform: "instagram" as const,
    caption: "Behind the scenes: how we vet every product 🔬",
    hashtag: "#PharmacistLed",
    link: "https://www.instagram.com/asper.beauty.shop/",
  },
  {
    id: 6,
    platform: "facebook" as const,
    caption: "Customer spotlight: Sara's acne journey ✨",
    hashtag: "#AsperStories",
    link: "https://www.facebook.com/robu.sweileh",
  },
];

export default function SocialGallery() {
  const { data } = useShopifyProducts(undefined, 6);
  const products = data || [];

  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge
            variant="outline"
            className="mb-4 border-accent text-accent font-body text-xs tracking-[0.2em] px-4 py-1.5"
          >
            <Instagram className="h-3 w-3 mr-2" />
            COMMUNITY
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            The <span className="text-primary">Inner Circle</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Real stories, expert tips, and curated routines from our community.
          </p>
        </div>

        {/* Social Posts Grid — using real product images as backgrounds */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {socialPosts.map((post, i) => {
            const productImage = products[i]?.node?.images?.edges?.[0]?.node?.url;
            const PlatformIcon = post.platform === "instagram" ? Instagram : Facebook;

            return (
              <motion.a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-border/50 hover:border-accent/40 transition-all duration-500"
              >
                {/* Product image background */}
                {productImage ? (
                  <BlurUpImage
                    src={productImage}
                    alt={post.caption}
                    className="transition-transform duration-700 group-hover:scale-110"
                    containerClassName="absolute inset-0"
                  />
                ) : (
                  <div className="absolute inset-0 bg-secondary" />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                {/* Permanent subtle bottom gradient for platform icon */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-foreground/40 to-transparent" />

                {/* Platform badge */}
                <div className="absolute top-3 left-3 z-10">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-sm group-hover:border-accent/50 transition-colors">
                    <PlatformIcon className="h-3.5 w-3.5 text-primary group-hover:text-accent transition-colors" />
                  </div>
                </div>

                {/* External link icon */}
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/90 backdrop-blur-sm">
                    <ExternalLink className="h-3 w-3 text-card" />
                  </div>
                </div>

                {/* Caption overlay on hover */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-card font-body text-xs sm:text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity line-clamp-2">
                    {post.caption}
                  </p>
                  <span className="text-accent text-[11px] font-body font-semibold tracking-wide">
                    {post.hashtag}
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Follow CTAs */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <a
            href="https://www.instagram.com/asper.beauty.shop/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-accent transition-colors"
          >
            <Instagram className="h-4 w-4" />
            <span>@asper.beauty.shop</span>
            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </a>
          <span className="text-border">|</span>
          <a
            href="https://www.facebook.com/robu.sweileh"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-accent transition-colors"
          >
            <Facebook className="h-4 w-4" />
            <span>Asper Beauty</span>
            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </a>
        </div>
      </div>
    </section>
  );
}
