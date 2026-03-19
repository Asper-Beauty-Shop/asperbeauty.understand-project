import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatJOD } from "@/lib/productImageUtils";
import { Loader2, Percent, Search, Tag } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number | null;
  brand: string | null;
  is_on_sale: boolean;
  original_price: number | null;
  discount_percent: number | null;
  primary_concern: string;
  [key: string]: unknown;
}

interface BulkSaleManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onComplete: () => void;
}

export function BulkSaleManager({ open, onOpenChange, products, onComplete }: BulkSaleManagerProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [discountPercent, setDiscountPercent] = useState("15");
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    );
  }, [products, search]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((p) => selectedIds.has(p.id));

  const toggleAll = () => {
    if (allFilteredSelected) {
      const next = new Set(selectedIds);
      filtered.forEach((p) => next.delete(p.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      filtered.forEach((p) => next.add(p.id));
      setSelectedIds(next);
    }
  };

  const toggle = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleApplySale = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) { toast.error("Select at least one product"); return; }
    const pct = parseInt(discountPercent, 10);
    if (isNaN(pct) || pct < 1 || pct > 99) { toast.error("Discount must be 1–99%"); return; }

    try {
      setIsSaving(true);
      let successCount = 0;

      // Process in batches of 20
      for (let i = 0; i < ids.length; i += 20) {
        const batch = ids.slice(i, i + 20);
        const updates = batch.map((id) => {
          const product = products.find((p) => p.id === id);
          const currentPrice = Number(product?.price ?? 0);
          // original_price = current price (before discount was applied)
          // new sale price = original * (1 - discount/100)
          const originalPrice = product?.is_on_sale && product?.original_price
            ? Number(product.original_price)
            : currentPrice;
          const salePrice = Math.round(originalPrice * (1 - pct / 100) * 100) / 100;

          return supabase
            .from("products")
            .update({
              is_on_sale: true,
              original_price: originalPrice,
              discount_percent: pct,
              price: salePrice,
            })
            .eq("id", id);
        });

        const results = await Promise.all(updates);
        successCount += results.filter((r) => !r.error).length;
      }

      toast.success(`Applied ${pct}% discount to ${successCount} products`);
      setSelectedIds(new Set());
      onComplete();
    } catch (err) {
      console.error("Bulk sale error:", err);
      toast.error("Failed to apply sale pricing");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSale = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) { toast.error("Select at least one product"); return; }

    try {
      setIsRemoving(true);
      let successCount = 0;

      for (let i = 0; i < ids.length; i += 20) {
        const batch = ids.slice(i, i + 20);
        const updates = batch.map((id) => {
          const product = products.find((p) => p.id === id);
          const restoredPrice = product?.original_price ? Number(product.original_price) : Number(product?.price ?? 0);

          return supabase
            .from("products")
            .update({
              is_on_sale: false,
              original_price: null,
              discount_percent: null,
              price: restoredPrice,
            })
            .eq("id", id);
        });

        const results = await Promise.all(updates);
        successCount += results.filter((r) => !r.error).length;
      }

      toast.success(`Removed sale from ${successCount} products`);
      setSelectedIds(new Set());
      onComplete();
    } catch (err) {
      console.error("Remove sale error:", err);
      toast.error("Failed to remove sale pricing");
    } finally {
      setIsRemoving(false);
    }
  };

  const selectedOnSaleCount = Array.from(selectedIds).filter((id) => products.find((p) => p.id === id)?.is_on_sale).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            Bulk Sale Manager
          </DialogTitle>
          <DialogDescription>
            Select products and apply a uniform discount percentage. The original price will be preserved.
          </DialogDescription>
        </DialogHeader>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <Label htmlFor="sale-search" className="text-xs">Search Products</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="sale-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or brand..."
                className="pl-9"
              />
            </div>
          </div>
          <div className="w-32">
            <Label htmlFor="discount-pct" className="text-xs">Discount %</Label>
            <div className="relative">
              <Input
                id="discount-pct"
                type="number"
                min={1}
                max={99}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="pr-8"
              />
              <Percent className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Selection info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{selectedIds.size} selected</span>
          {selectedOnSaleCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedOnSaleCount} already on sale
            </Badge>
          )}
        </div>

        {/* Product list */}
        <div className="flex-1 overflow-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-10">
                  <Checkbox
                    checked={allFilteredSelected}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow
                  key={product.id}
                  className={selectedIds.has(product.id) ? "bg-primary/5" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(product.id)}
                      onCheckedChange={() => toggle(product.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-sm max-w-[200px] truncate">
                    {product.title}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {product.brand || "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {product.is_on_sale && product.original_price ? (
                      <div>
                        <span className="line-through text-muted-foreground text-xs mr-1">
                          {formatJOD(Number(product.original_price))}
                        </span>
                        <span className="text-destructive font-semibold">
                          {formatJOD(Number(product.price))}
                        </span>
                      </div>
                    ) : (
                      <span>{formatJOD(Number(product.price))}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.is_on_sale ? (
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                        {product.discount_percent}% OFF
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Regular</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="flex-row gap-2 sm:gap-2">
          {selectedOnSaleCount > 0 && (
            <Button
              variant="outline"
              onClick={handleRemoveSale}
              disabled={isRemoving || isSaving}
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              {isRemoving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Remove Sale ({selectedOnSaleCount})
            </Button>
          )}
          <Button
            onClick={handleApplySale}
            disabled={isSaving || isRemoving || selectedIds.size === 0}
            className="bg-primary text-primary-foreground"
          >
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Apply {discountPercent}% Off ({selectedIds.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
