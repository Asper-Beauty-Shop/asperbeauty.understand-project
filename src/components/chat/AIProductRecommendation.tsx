import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

interface RecommendedProductProps {
  product: {
    id: string;
    brand: string;
    name: string;
    keyBenefit: string;
    price: number;
    imageUrl: string;
  };
  aiRationale: string;
  persona: "sami" | "zain";
}

export function AIProductRecommendation({
  product,
  aiRationale,
  persona,
}: RecommendedProductProps) {
  const [isAdded, setIsAdded] = useState(false);
  const addMultiple = useCartStore((s) => s.addMultipleFromPrescription);

  const handleAddToBag = async () => {
    await addMultiple([
      {
        id: product.id,
        title: product.name,
        price: product.price,
        image_url: product.imageUrl,
        brand: product.brand,
      },
    ]);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const isSami = persona === "sami";

  return (
    <div className="w-full max-w-[90%] bg-background border border-border rounded-xl overflow-hidden shadow-sm my-2 ml-11">
      {/* AI Rationale header */}
      <div
        className={`px-4 py-2 text-xs font-sans leading-relaxed ${
          isSami
            ? "bg-foreground text-background"
            : "bg-accent text-accent-foreground"
        }`}
      >
        <span className="font-semibold tracking-wide block mb-0.5">
          Recommendation:
        </span>
        {aiRationale}
      </div>

      {/* Product micro-card */}
      <div className="p-3 flex gap-3 items-center hover:bg-secondary/50 transition-colors duration-300">
        <div className="w-16 h-20 bg-secondary shrink-0 border border-border flex items-center justify-center overflow-hidden">
          <img
            src={product.imageUrl || "/editorial-showcase-2.jpg"}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-sans font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">
            {product.brand}
          </span>
          <h4 className="text-sm font-serif text-foreground leading-tight truncate">
            {product.name}
          </h4>
          <p className="text-xs font-sans text-muted-foreground italic truncate mt-0.5">
            {product.keyBenefit}
          </p>
          <p className="text-sm font-sans font-semibold text-foreground mt-1.5">
            {product.price.toFixed(2)} JOD
          </p>
        </div>
      </div>

      {/* One-click add */}
      <div className="px-3 pb-3 pt-1">
        <button
          onClick={handleAddToBag}
          disabled={isAdded}
          className={`w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold tracking-wide transition-all duration-300 ${
            isAdded
              ? "bg-secondary text-foreground border border-border"
              : "bg-primary text-primary-foreground hover:bg-primary/80"
          }`}
        >
          {isAdded ? (
            <>
              <Check size={16} className="text-green-600" /> ADDED TO BAG
            </>
          ) : (
            <>
              <ShoppingBag size={16} /> ADD TO BAG
            </>
          )}
        </button>
      </div>
    </div>
  );
}

