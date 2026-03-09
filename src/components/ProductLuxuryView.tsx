import React, { useState } from "react";
import {
  Droplets,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCartStore } from "@/stores/cartStore";
import { formatJOD } from "@/lib/productImageUtils";
import { toast } from "sonner";

interface ProductLuxuryViewProps {
  product: {
    id: string;
    brand?: string;
    title: string;
    price: number;
    description?: string;
    image_url?: string;
    category?: string;
  };
}

export const ProductLuxuryView = ({ product }: ProductLuxuryViewProps) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { language } = useLanguage();
  const isAr = language === "ar";
  const addItem = useCartStore((state) => state.addItem);

  // Mock additional images for gallery effect
  const images = [
    product.image_url ||
    "/assets/luxury-asset-1.png",
    "/assets/luxury-asset-2.png",
    "/assets/luxury-asset-3.png",
  ];

  const handleAddToBag = () => {
    const cartItem = {
      product: {
        node: {
          id: product.id,
          title: product.title,
          handle: product.id,
          description: product.description || "",
          priceRange: {
            minVariantPrice: {
              amount: product.price.toString(),
              currencyCode: "JOD",
            },
          },
          images: {
            edges: [{
              node: { url: product.image_url || "", altText: product.title },
            }],
          },
          variants: { edges: [] },
          options: [],
        },
      },
      variantId: product.id,
      variantTitle: "Default",
      price: { amount: product.price.toString(), currencyCode: "JOD" },
      quantity: quantity,
      selectedOptions: [],
    };
    addItem(cartItem);
    toast.success(isAr ? "ØªÙ…Øª Ø§Ù„Ø¥Ø¶Ø§ÙØ© Ø¥Ù„Ù‰ Ø§Ù„Ø­Ù‚ÙŠØ¨Ø©" : "Added to your ritual");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Split Screen Layout */}
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* LEFT: The Gallery (Cinematic Scroll) */}
        <div className="bg-muted/30 lg:overflow-y-auto">
          <div className="space-y-1">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-[4/5] overflow-hidden cursor-pointer"
                onClick={() => setActiveImage(idx)}
              >
                <img
                  src={img}
                  alt={`${product.title} - View ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                {/* Subtle Image Caption */}
                <div className="absolute bottom-6 left-6 text-xs font-light tracking-widest text-white/70 uppercase">
                  Figure 0{idx + 1} â€” {idx === 0
                    ? "The Vessel"
                    : idx === 1
                    ? "The Texture"
                    : "The Ritual"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: The Editorial Details (Sticky) */}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto bg-background">
          <div className="p-8 lg:p-16 flex flex-col justify-center min-h-full">
            {/* A. Header */}
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3 block">
                {product.brand || product.category}
              </span>
              <h1 className="font-serif text-3xl lg:text-4xl text-foreground leading-tight mb-6">
                {product.title}
              </h1>

              {/* Price & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-light text-foreground">
                  {formatJOD(product.price)}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    (1,240 {isAr ? "ØªÙ‚ÙŠÙŠÙ…" : "Reviews"})
                  </span>
                </div>
              </div>
            </div>

            {/* B. The "Story" (Description) */}
            <p className="text-muted-foreground leading-relaxed mb-8 font-light">
              {product.description ||
                "Experience the next generation of our revolutionary formula. This deep- and fast-penetrating serum reduces the look of multiple signs of aging caused by the environmental assaults of modern life."}
            </p>

            {/* C. Sensory Details (Texture/Scent) */}
            <div className="grid grid-cols-2 gap-6 mb-10 pb-10 border-b border-border">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Droplets className="w-4 h-4 text-primary" />
                  {isAr ? "Ø§Ù„Ù‚ÙˆØ§Ù…" : "Texture"}
                </div>
                <p className="text-sm text-muted-foreground">
                  Silky, oil-free serum
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {isAr ? "Ø§Ù„Ø¹Ø·Ø±" : "Scent"}
                </div>
                <p className="text-sm text-muted-foreground">
                  Fragrance-free, natural notes
                </p>
              </div>
            </div>

            {/* D. Action Area */}
            <div className="space-y-6 mb-10">
              {/* Quantity Selector */}
              <div className="flex items-center justify-center gap-8 py-4 border border-border rounded-none">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:text-primary transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-medium w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Bag Button */}
              <Button
                onClick={handleAddToBag}
                className="w-full py-6 text-base font-medium tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground rounded-none"
              >
                <ShoppingBag className="w-5 h-5 mr-3" />
                {isAr ? "Ø£Ø¶Ù Ø¥Ù„Ù‰ Ø§Ù„Ø­Ù‚ÙŠØ¨Ø©" : "Add to Ritual"} â€”{" "}
                {formatJOD(product.price * quantity)}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" />
                {isAr
                  ? "Ù…ÙˆØ²Ø¹ Ù…Ø¹ØªÙ…Ø¯ â€¢ Ù…Ù†ØªØ¬ Ø£ØµÙ„ÙŠ 100%"
                  : "Authorized Retailer â€¢ 100% Authentic"}
              </div>
            </div>

            {/* Concierge Tip Card */}
            <div className="relative bg-asper-stone-light border border-accent shadow-md p-6 rounded-sm mt-2">
              {/* Decorative gold pin */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="8" r="7" stroke="#C5A028" strokeWidth="1.5" fill="#F8F8FF" />
                  <circle cx="12" cy="8" r="3" fill="#C5A028" />
                  <line x1="12" y1="15" x2="12" y2="24" stroke="#C5A028" strokeWidth="1.5" />
                </svg>
              </div>
              <p className="font-display text-sm text-primary mb-2 mt-1 text-center tracking-wide">
                {isAr ? "Ù†ØµÙŠØ­Ø© Ø§Ù„ÙƒÙˆÙ†Ø³ÙŠØ±Ø¬" : "Concierge Tip"}
              </p>
              <p className="font-body text-xs text-muted-foreground leading-relaxed text-center italic">
                {product.category?.toLowerCase().includes("acne") || product.title?.toLowerCase().includes("cleanser")
                  ? (isAr
                    ? "\"Ø¯. Ø³Ø§Ù…ÙŠ ÙŠÙ†ØµØ­: Ø¶Ø¹ÙŠÙ‡ Ø¹Ù„Ù‰ Ø¨Ø´Ø±Ø© Ø±Ø·Ø¨Ø© Ù„ØªØ¹Ø²ÙŠØ² Ø§Ù…ØªØµØ§Øµ Ø­Ù…Ø¶ Ø§Ù„Ù‡ÙŠØ§Ù„ÙˆØ±ÙˆÙ†ÙŠÙƒ.\""
                    : "\"Dr. Sami recommends: Apply to damp skin to lock in hyaluronic acid for maximum hydration.\"")
                  : (isAr
                    ? "\"Ù…Ø³ Ø²ÙŠÙ† ØªÙ†ØµØ­: Ø§Ù…Ø²Ø¬ÙŠÙ‡ Ù…Ø¹ Ù‚Ø·Ø±Ø© Ø³ÙŠØ±ÙˆÙ… Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø¥Ø´Ø±Ø§Ù‚Ø© Ø²Ø¬Ø§Ø¬ÙŠØ©.\""
                    : "\"Ms. Zain suggests: Mix with a drop of serum for a glass-skin finish.\"")}
              </p>
            </div>

            {/* E. The "Accordion" Details */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ritual" className="border-border">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-widest hover:no-underline">
                  {isAr ? "Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù…" : "The Ritual"}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-start gap-3 py-2">
                    <Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isAr
                        ? "Ø¶Ø¹ÙŠÙ‡ ØµØ¨Ø§Ø­Ø§Ù‹ ÙˆÙ…Ø³Ø§Ø¡Ù‹ Ø¹Ù„Ù‰ Ø¨Ø´Ø±Ø© Ù†Ø¸ÙŠÙØ© Ù‚Ø¨Ù„ Ø§Ù„Ù…Ø±Ø·Ø¨. Ø§Ø³ØªØ®Ø¯Ù…ÙŠ Ù‚Ø·Ø±Ø© ÙˆØ§Ø­Ø¯Ø© ÙˆÙˆØ²Ø¹ÙŠÙ‡Ø§ Ø¨Ù„Ø·Ù Ø¹Ù„Ù‰ Ø§Ù„ÙˆØ¬Ù‡ ÙˆØ§Ù„Ø±Ù‚Ø¨Ø©."
                        : "Apply AM and PM on clean skin before your moisturizer. Use one dropper. Gently smooth over face and throat."}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ingredients" className="border-border">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-widest hover:no-underline">
                  {isAr ? "Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©" : "Key Ingredients"}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Bifida Ferment Lysate, Peg-8, Propanediol, Bis-Peg-18 Methyl
                    Ether Dimethyl Silane, Methyl Gluceth-20, Glycereth-26.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping" className="border-border">
                <AccordionTrigger className="text-sm font-medium uppercase tracking-widest hover:no-underline">
                  {isAr ? "Ø§Ù„Ø´Ø­Ù† ÙˆØ§Ù„Ø¥Ø±Ø¬Ø§Ø¹" : "Shipping & Returns"}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isAr
                      ? "Ø´Ø­Ù† Ù…Ø¬Ø§Ù†ÙŠ Ù„Ù„Ø·Ù„Ø¨Ø§Øª ÙÙˆÙ‚ 50 Ø¯ÙŠÙ†Ø§Ø±. Ø§Ù„ØªÙˆØµÙŠÙ„ Ø®Ù„Ø§Ù„ 24-48 Ø³Ø§Ø¹Ø© ÙÙŠ Ø¹Ù…Ø§Ù†."
                      : "Free shipping on all orders over 50 JOD. Delivered within 24-48 hours in Amman."}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Cross-sell Section */}
      <section className="py-20 px-8 lg:px-16 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-2xl lg:text-3xl text-center mb-12">
            {isAr ? "Ø£ÙƒÙ…Ù„ÙŠ Ø·Ù‚ÙˆØ³Ùƒ" : "Complete The Ritual"}
          </h2>
          {/* Product recommendations would go here */}
        </div>
      </section>
    </div>
  );
};

