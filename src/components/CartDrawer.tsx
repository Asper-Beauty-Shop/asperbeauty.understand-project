import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, Leaf, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-background transition-transform duration-700 ease-luxury">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-heading text-2xl">Your Regimen</SheetTitle>
          <SheetDescription className="font-body">
            {totalItems === 0 ? "Your regimen is empty" : `${totalItems} item${totalItems !== 1 ? 's' : ''} curated for you`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 border border-primary/10">
                  <ShoppingCart className="h-10 w-10 text-primary/40" />
                </div>
                <p className="font-heading text-lg font-semibold text-foreground mb-1">Your regimen is empty</p>
                <p className="text-sm text-muted-foreground font-body mb-4">Need a recommendation?</p>
                <a href="/intelligence" className="text-sm font-body font-semibold text-primary hover:text-primary/80 transition-colors">
                  Ask Dr. Sami →
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 p-3 rounded-lg border border-border/50 bg-card shadow-maroon-glow">
                      {/* Square, object-contain image */}
                      <div className="w-16 h-16 bg-background rounded-md overflow-hidden flex-shrink-0 border border-border/30 flex items-center justify-center">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-contain p-1"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-body font-semibold text-sm truncate text-primary">{item.product.node.title}</h4>
                        <p className="text-xs text-muted-foreground font-body">{item.selectedOptions.map(o => o.value).join(' · ')}</p>
                        <p className="font-body font-semibold text-sm text-foreground mt-1">
                          <span className="text-[10px] align-top mr-0.5 font-normal text-muted-foreground">{item.price.currencyCode}</span>
                          {parseFloat(item.price.amount).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.variantId)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-body">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pharmacist Verification Badge */}
                <div className="mt-6 flex items-center gap-2.5 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3">
                  <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
                  <div>
                    <p className="text-xs font-body font-semibold text-foreground">Verified by Dr. Sami</p>
                    <p className="text-[10px] text-muted-foreground font-body">All items checked for safety & interactions.</p>
                  </div>
                </div>

                {/* Smart Cross-Sell */}
                <div className="mt-4 rounded-lg border border-accent/30 bg-card p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-accent" />
                    <p className="text-xs font-body font-semibold text-accent uppercase tracking-wider">Complete the Routine</p>
                  </div>
                  <p className="text-sm font-body text-muted-foreground">
                    Add a moisturizer to lock in your treatment's benefits overnight.
                  </p>
                  <a href="/products?q=moisturizer" className="text-xs font-body font-semibold text-primary hover:text-primary/80 transition-colors">
                    Browse Moisturizers →
                  </a>
                </div>
              </div>

              {/* Footer — Totals + Checkout */}
              <div className="flex-shrink-0 space-y-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold font-heading">Total</span>
                  <span className="text-xl font-bold text-foreground font-body">
                    <span className="text-xs align-top mr-0.5 font-normal text-muted-foreground">{items[0]?.price.currencyCode || 'JOD'}</span>
                    {totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-ripple h-12 text-sm uppercase tracking-widest"
                  size="lg"
                  disabled={items.length === 0 || isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Checkout with Shopify
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
