import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowLeft,
  Loader2,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { ASPER_PROTOCOL } from "@/lib/asperProtocol";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateTitle } from "@/lib/productUtils";
import { CODCheckoutForm, OrderSuccess } from "./CODCheckoutForm";

const FREE_SHIPPING_THRESHOLD = 50; // JOD

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export const CartDrawer = () => {
  const [checkoutMode, setCheckoutMode] = useState<"cart" | "cod" | "success">("cart");
  const [orderNumber, setOrderNumber] = useState<string>("");

  const {
    items,
    isLoading,
    isOpen,
    updateQuantity,
    removeItem,
    setOpen,
    getTotalPrice,
  } = useCartStore();

  const totalPrice = getTotalPrice();
  const { t, isRTL, language } = useLanguage();
  const isArabic = language === "ar";

  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const shippingProgress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100);
  const hasFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;

  const handleCheckout = () => {
    setCheckoutMode("cod");
  };

  const handleDrawerOpen = (open: boolean) => {
    handleOpenChange(open);
  };

  const handleCODSuccess = (orderNum: string) => {
    setOrderNumber(orderNum);
    setCheckoutMode("success");
  };

  const handleCloseAfterSuccess = () => {
    setCheckoutMode("cart");
    setOrderNumber("");
    setOpen(false);
  };

  const handleBackToCart = () => {
    setCheckoutMode("cart");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) setCheckoutMode("cart");
    setOpen(open);
  };

  const isClinical = items.some((item) => {
    const vendor = item.product.node.vendor?.toLowerCase() || "";
    return ["la roche-posay", "vichy", "eucerin", "bioderma", "cerave", "sesderma"].some(b => vendor.includes(b.toLowerCase()));
  });

  return (
    <Sheet open={isOpen} onOpenChange={handleDrawerOpen}>
      <SheetContent
        className={`w-full sm:max-w-[450px] flex flex-col h-full p-0 backdrop-blur-2xl ${
          isRTL ? "border-r-0" : ""
        }`}
        side={isRTL ? "left" : "right"}
        style={{
          backgroundColor: "hsl(240 100% 99% / 0.92)",
          borderLeftWidth: "1px",
          borderLeftColor: "hsl(43 69% 46% / 0.3)",
          boxShadow: "0 8px 60px 0 rgba(0, 0, 0, 0.06), inset 0 1px 0 0 hsl(43 69% 46% / 0.1)",
        }}
      >
        {/* ─── Header: "Your Curated Regimen" ─── */}
        <SheetHeader
          className="flex-shrink-0 px-8 pt-8 pb-5"
          style={{
            borderBottom: "1px solid hsl(43 69% 46% / 0.2)",
            background: "linear-gradient(180deg, hsl(240 100% 99% / 0.98) 0%, hsl(240 100% 99% / 0.85) 100%)",
          }}
        >
          <div className="flex items-center justify-between">
            {checkoutMode === "cod" && (
              <button
                onClick={handleBackToCart}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <SheetTitle className="font-heading text-2xl tracking-wide flex-1" style={{ color: "hsl(var(--asper-ink))" }}>
              {checkoutMode === "success"
                ? (isArabic ? "تم الطلب بنجاح" : "Order Confirmed")
                : checkoutMode === "cod"
                ? (isArabic ? "الدفع عند الاستلام" : "Cash on Delivery")
                : (isArabic ? "روتينك المختار" : "Your Curated Regimen")}
            </SheetTitle>
            <button
              onClick={() => handleOpenChange(false)}
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Progress — Gold glass bar */}
          {checkoutMode === "cart" && items.length > 0 && (
            <div className="mt-4">
              <div
                className="h-[3px] rounded-full overflow-hidden"
                style={{ backgroundColor: "hsl(43 69% 46% / 0.12)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: "hsl(var(--polished-gold))" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${shippingProgress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <p className="font-body text-[11px] text-muted-foreground mt-2 text-center tracking-wide">
                {hasFreeShipping
                  ? (isArabic ? "🎁 شحن مجاني مفعّل!" : "🎁 Complimentary Shipping Unlocked!")
                  : (isArabic
                    ? `أنت على بعد ${amountToFreeShipping.toFixed(0)} دينار من الشحن المجاني`
                    : `You are ${amountToFreeShipping.toFixed(0)} JOD away from Complimentary Shipping`)}
              </p>
            </div>
          )}
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Success Mode */}
          {checkoutMode === "success" && (
            <div className="flex-1 p-8">
              <OrderSuccess orderNumber={orderNumber} onClose={handleCloseAfterSuccess} />
            </div>
          )}

          {/* COD Checkout Mode */}
          {checkoutMode === "cod" && (
            <div className="flex-1 p-8 overflow-y-auto">
              <CODCheckoutForm onSuccess={handleCODSuccess} onCancel={handleBackToCart} />
            </div>
          )}

          {/* Cart Mode */}
          {checkoutMode === "cart" && (
            <>
              {items.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center backdrop-blur-md"
                      style={{ backgroundColor: "hsl(240 100% 99% / 0.6)", border: "1px solid hsl(43 69% 46% / 0.2)" }}
                    >
                      <Stethoscope className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <p className="font-heading text-lg mb-1" style={{ color: "hsl(var(--asper-ink))" }}>
                      {isArabic ? "لم يُوصف شيء بعد" : "No Prescriptions Yet"}
                    </p>
                    <p className="font-body text-sm text-muted-foreground">
                      {isArabic ? "تصفحي المنتجات أو استشيري الدكتور سامي" : "Browse products or consult with Dr. Sami"}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* ─── Cart Items — Frosted Clinical Rows ─── */}
                  <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0">
                    <AnimatePresence mode="popLayout">
                      <div className="space-y-5">
                        {items.map((item, index) => (
                          <motion.div
                            key={item.variantId}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            transition={{ delay: index * 0.06 }}
                            className="flex gap-4 group p-3 rounded-sm transition-colors duration-300"
                            style={{
                              backgroundColor: "hsl(240 100% 99% / 0.5)",
                              backdropFilter: "blur(12px) saturate(1.1)",
                              border: "1px solid hsl(43 69% 46% / 0.12)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "hsl(43 69% 46% / 0.35)";
                              e.currentTarget.style.backgroundColor = "hsl(240 100% 99% / 0.7)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "hsl(43 69% 46% / 0.12)";
                              e.currentTarget.style.backgroundColor = "hsl(240 100% 99% / 0.5)";
                            }}
                          >
                            {/* Thumbnail */}
                            <div
                              className="w-20 h-20 overflow-hidden flex-shrink-0"
                              style={{ backgroundColor: "hsl(var(--asper-stone))" }}
                            >
                              {item.product.node.images?.edges?.[0]?.node && (
                                <img
                                  src={item.product.node.images.edges[0].node.url}
                                  alt={item.product.node.title}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                {item.product.node.vendor || "Brand"}
                              </p>
                              <h4 className="font-heading text-sm leading-tight line-clamp-2 mt-0.5" style={{ color: "hsl(var(--asper-ink))" }}>
                                {translateTitle(item.product.node.title, language)}
                              </h4>
                              <p className="font-body text-sm font-medium mt-1" style={{ color: "hsl(var(--asper-ink))" }}>
                                {parseFloat(item.price.amount).toFixed(3)} {item.price.currencyCode}
                              </p>
                            </div>

                            {/* Quantity & Remove */}
                            <div className="flex flex-col items-end justify-between flex-shrink-0">
                              <button
                                onClick={() => removeItem(item.variantId)}
                                className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <div
                                className="flex items-center overflow-hidden"
                                style={{
                                  border: "1px solid hsl(43 69% 46% / 0.25)",
                                  backgroundColor: "hsl(240 100% 99% / 0.6)",
                                }}
                              >
                                <button
                                  onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                  className="w-7 h-7 flex items-center justify-center hover:bg-muted/50 transition-colors"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center text-sm font-body">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                  className="w-7 h-7 flex items-center justify-center hover:bg-muted/50 transition-colors"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </AnimatePresence>

                    {/* ─── AI Prescription Upsell Block — Glass Card ─── */}
                    {items.length > 0 && (
                      <div
                        className="mt-8 p-6 relative backdrop-blur-md"
                        style={{
                          border: "1px dashed hsl(43 69% 46% / 0.35)",
                          backgroundColor: "hsl(240 100% 99% / 0.45)",
                        }}
                      >
                        {/* Floating label */}
                        <div
                          className="absolute -top-3 left-4 px-2"
                          style={{ backgroundColor: "hsl(240 100% 99% / 0.9)" }}
                        >
                          <span className="font-body text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: "hsl(var(--burgundy))" }}>
                            {isClinical
                              ? (isArabic ? "وصفة الدكتور سامي" : "Dr. Sami Prescribes")
                              : (isArabic ? "اقتراح مس زين" : "Ms. Zain Suggests")}
                          </span>
                        </div>

                        <div className="flex gap-4 items-start mt-2">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: isClinical ? "hsl(var(--burgundy) / 0.1)" : "hsl(var(--polished-gold) / 0.15)",
                            }}
                          >
                            {isClinical
                              ? <Stethoscope className="w-5 h-5 text-burgundy" />
                              : <Sparkles className="w-5 h-5 text-polished-gold" />
                            }
                          </div>

                          <div className="flex-1">
                            <p className="font-body text-xs text-muted-foreground leading-relaxed">
                              {isArabic
                                ? `لتعزيز فعالية ${items[0]?.product.node.title?.slice(0, 30) || "منتجك"}، ننصح بإضافة مكمّل فعّال.`
                                : `To maximize the efficacy of your ${items[0]?.product.node.title?.slice(0, 30) || "product"}, we prescribe adding a complementary active.`}
                            </p>
                            <button
                              className="mt-3 font-body text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300"
                              style={{ color: "hsl(var(--burgundy))" }}
                              onMouseEnter={(e) => e.currentTarget.style.color = "hsl(var(--polished-gold))"}
                              onMouseLeave={(e) => e.currentTarget.style.color = "hsl(var(--burgundy))"}
                            >
                              {isArabic ? "+ أضف إلى الروتين" : "+ Add to Regimen"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ─── Checkout Footer — Frosted Glass ─── */}
                  <div
                    className="flex-shrink-0 p-8 backdrop-blur-xl"
                    style={{
                      borderTop: "1px solid hsl(43 69% 46% / 0.2)",
                      backgroundColor: "hsl(240 100% 99% / 0.88)",
                    }}
                  >
                    {/* Trust Signal */}
                    <div className="flex items-center justify-center gap-1.5 mb-4">
                      <ShieldCheck className="w-3.5 h-3.5" style={{ color: "hsl(var(--polished-gold))" }} />
                      <span className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {isArabic ? "شراء آمن ومضمون" : "Secure & Verified Purchase"}
                      </span>
                    </div>

                    {/* Subtotal */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-body text-sm text-muted-foreground tracking-wide">
                        {isArabic ? "المجموع المقدّر" : "Estimated Total"}
                      </span>
                      <span className="font-heading text-xl" style={{ color: "hsl(var(--asper-ink))" }}>
                        {totalPrice.toFixed(3)} {items[0]?.price.currencyCode || "JOD"}
                      </span>
                    </div>

                    {/* Checkout Buttons */}
                    <div className="flex flex-col gap-3">
                      {/* Primary: COD */}
                      <button
                        onClick={() => setCheckoutMode("cod")}
                        disabled={items.length === 0 || isLoading}
                        className="w-full py-4 font-body text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                        style={{ backgroundColor: "hsl(var(--burgundy))" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "hsl(var(--burgundy-dark))"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "hsl(var(--burgundy))"}
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                          <>
                            <Truck className="w-4 h-4" />
                            {isArabic ? "تأمين الروتين والدفع عند الاستلام" : "Secure Regimen & Checkout"}
                          </>
                        )}
                      </button>

                      {/* Secondary: Card */}
                      <button
                        onClick={handleCheckout}
                        disabled={items.length === 0 || isLoading}
                        className="w-full py-3 font-body text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                        style={{
                          border: "2px solid hsl(var(--burgundy))",
                          color: "hsl(var(--burgundy))",
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "hsl(var(--burgundy))";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "hsl(var(--burgundy))";
                        }}
                      >
                        <Lock className="w-4 h-4" />
                        {isArabic ? "الدفع بالبطاقة" : "Pay with Card"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
