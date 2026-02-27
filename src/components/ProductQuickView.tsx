import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { formatJOD, getProductImage } from "@/lib/productImageUtils";

interface Product {
  id: string;
  title: string;
  price: number;
  description: string | null;
  image_url: string | null;
  brand: string | null;
  category?: string;
}

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductQuickView = ({ product, open, onOpenChange, onAddToCart }: ProductQuickViewProps) => {
  if (!product) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif">{product.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img src={getProductImage(product.image_url)} alt={product.title} className="w-full aspect-square object-cover rounded-lg" />
          {product.brand && <p className="text-xs text-muted-foreground uppercase tracking-widest">{product.brand}</p>}
          <p className="text-sm text-muted-foreground">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">{formatJOD(product.price)}</span>
            {onAddToCart && (
              <Button onClick={() => onAddToCart(product)} size="sm" className="gap-2">
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
