import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/hooks/useProducts";
import { Package, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

function formatStep(step: string) {
  return step.replace(/^Step_\d+_/, "").replace(/([A-Z])/g, " $1").trim();
}

function formatConcern(concern: string) {
  return concern.replace("Concern_", "");
}

export function ProductCard({ product }: { product: Product }) {
  const isGold = product.gold_stitch_tier;

  return (
    <Card
      className={cn(
        "group overflow-hidden bg-card transition-all hover:-translate-y-1",
        isGold
          ? "border-accent/60 hover:border-accent hover:shadow-[0_8px_30px_-8px_hsl(var(--accent)/0.35)]"
          : "border-border/50 hover:shadow-lg"
      )}
    >
      <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
        {product.image_url && !product.image_url.includes("example.com") ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <Package className="h-16 w-16 text-muted-foreground/40" />
        )}
        {product.clinical_badge && (
          <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-foreground shadow-sm">
            <Shield className="h-3 w-3 text-primary" />
            {product.clinical_badge}
          </span>
        )}
        {isGold && (
          <span className="absolute top-2 right-2 text-accent text-lg">★</span>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            {product.brand && (
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {product.brand}
              </p>
            )}
            <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2">
              {product.title}
            </h3>
          </div>
          {product.price && (
            <span className="text-sm font-bold text-foreground whitespace-nowrap">
              ${Number(product.price).toFixed(2)}
            </span>
          )}
        </div>

        {product.texture_profile && (
          <p className="text-[11px] italic text-muted-foreground">
            {product.texture_profile}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-[10px] font-medium">
            {formatStep(product.regimen_step)}
          </Badge>
          <Badge variant="outline" className="text-[10px] font-medium">
            {formatConcern(product.primary_concern)}
          </Badge>
          {product.is_hero && (
            <Badge className="text-[10px] bg-primary text-primary-foreground">
              Hero
            </Badge>
          )}
          {product.ai_persona_lead && (
            <Badge variant="outline" className="text-[10px] font-medium border-accent/50 text-accent-foreground">
              {product.ai_persona_lead === "dr_sami" ? "🔬 Dr. Sami" : "✨ Ms. Zain"}
            </Badge>
          )}
        </div>

        {product.key_ingredients && product.key_ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.key_ingredients.slice(0, 3).map((ing) => (
              <span key={ing} className="text-[10px] rounded-full bg-muted px-1.5 py-0.5 text-muted-foreground">
                {ing}
              </span>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {product.inventory_total} in stock
        </p>
      </CardContent>
    </Card>
  );
}
