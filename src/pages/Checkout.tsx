import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ChevronDown, CreditCard, Banknote, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useCartStore } from "../stores/cartStore";
import AsperLogo from "../components/brand/AsperLogo";
import { cn } from "../lib/utils";
import { normalizePrice } from "../lib/shopify";
import { playSuccessSound } from "../lib/sounds";

/* ─── Jordanian Location Data ─── */
const CITIES = [
  { value: "amman", label: "Amman - عمّان" },
  { value: "zarqa", label: "Zarqa - الزرقاء" },
  { value: "irbid", label: "Irbid - إربد" },
  { value: "aqaba", label: "Aqaba - العقبة" },
  { value: "salt", label: "Salt - السلط" },
  { value: "madaba", label: "Madaba - مادبا" },
  { value: "jerash", label: "Jerash - جرش" },
  { value: "mafraq", label: "Mafraq - المفرق" },
  { value: "karak", label: "Karak - الكرك" },
];

const AMMAN_AREAS = [
  "Dabouq", "Abdoun", "Khalda", "Sweifieh", "Shmeisani", "Jabal Amman",
  "Jubeiha", "Tla' al-Ali", "Um Uthaina", "Al-Rabieh", "Marj al-Hamam",
  "Airport Road", "Abu Alanda", "Tabarbour", "Al-Hashmi",
];

type PaymentMethod = "cod" | "card";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getCheckoutUrl } = useCartStore();
  const totalPrice = items.reduce((sum: number, item: any) => sum + normalizePrice(item.price.amount) * item.quantity, 0);
  const deliveryFee = totalPrice >= 50 ? 0 : 3;
  const currency = items[0]?.price.currencyCode || "JOD";

  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [shakeFields, setShakeFields] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const triggerShake = (fields: string[]) => {
    setShakeFields(new Set(fields));
    // Haptic feedback
    if ("vibrate" in navigator) navigator.vibrate(50);
    setTimeout(() => setShakeFields(new Set()), 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing: string[] = [];
    if (!fullName.trim()) missing.push("fullName");
    if (!phone.trim() || phone.replace(/\D/g, "").length < 9) missing.push("phone");
    if (!city) missing.push("city");
    if (!address.trim()) missing.push("address");

    if (missing.length > 0) {
      triggerShake(missing);
      return;
    }

    if (paymentMethod === "card") {
      // Redirect to Shopify checkout for card payments
      const checkoutUrl = getCheckoutUrl();
      if (checkoutUrl) {
        window.open(checkoutUrl, "_blank");
      }
    } else {
      // COD flow — show confirmation
      setSubmitting(true);
      playSuccessSound();
      if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
      setTimeout(() => {
        setSubmitting(false);
        navigate("/");
      }, 2000);
    }
  };

  const formatPhone = (val: string) => {
    // Only allow digits after +962
    const digits = val.replace(/\D/g, "").slice(0, 9);
    setPhone(digits);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <p className="font-heading text-xl text-foreground mb-4">Your cart is empty</p>
        <Link to="/products">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Enclosed "Trust Tunnel" Header ─── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-body">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <Link to="/">
            <AsperLogo size={40} />
          </Link>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-body">
            <Lock className="h-3.5 w-3.5 text-accent" />
            <span>Secure Checkout</span>
          </div>
        </div>
        {/* Gold trust line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        {/* Order Summary */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg text-foreground">Order Summary</h2>
          <div className="space-y-3">
            {items.map((item: any) => (
              <div key={item.variantId} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card p-3">
                <div className="h-12 w-12 rounded-md bg-secondary overflow-hidden shrink-0 flex items-center justify-center">
                  {item.product.node.images?.edges?.[0]?.node && (
                    <img src={item.product.node.images.edges[0].node.url} alt="" className="h-full w-full object-contain p-0.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium text-foreground truncate">{item.product.node.title}</p>
                  <p className="text-xs text-muted-foreground font-body">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-body font-semibold text-foreground shrink-0">
                  {(normalizePrice(item.price.amount) * item.quantity).toFixed(2)} {currency}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <div className="flex justify-between text-sm font-body text-muted-foreground">
              <span>Subtotal</span>
              <span>{totalPrice.toFixed(2)} {currency}</span>
            </div>
            <div className="flex justify-between text-sm font-body text-muted-foreground">
              <span>Delivery {deliveryFee === 0 && <span className="text-accent text-xs">(Free!)</span>}</span>
              <span>{deliveryFee.toFixed(2)} {currency}</span>
            </div>
            <div className="flex justify-between text-base font-heading font-bold text-foreground pt-1">
              <span>Total</span>
              <span>{(totalPrice + deliveryFee).toFixed(2)} {currency}</span>
            </div>
            {totalPrice < 50 && (
              <p className="text-xs text-accent font-body italic">
                Add {(50 - totalPrice).toFixed(2)} {currency} more for free delivery!
              </p>
            )}
          </div>
        </section>

        {/* Delivery Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-4">
            <h2 className="font-heading text-lg text-foreground">Delivery Details</h2>

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="font-body text-sm">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className={cn(
                  "h-12 rounded-xl font-body",
                  shakeFields.has("fullName") && "animate-shake border-destructive"
                )}
              />
              {shakeFields.has("fullName") && (
                <p className="text-xs text-destructive font-body">Please enter your name so we know who to deliver to.</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="font-body text-sm">Phone Number</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-body font-semibold">
                  +962
                </span>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => formatPhone(e.target.value)}
                  placeholder="7X XXX XXXX"
                  maxLength={10}
                  className={cn(
                    "h-12 rounded-xl font-body pl-14",
                    shakeFields.has("phone") && "animate-shake border-destructive"
                  )}
                />
              </div>
              {shakeFields.has("phone") && (
                <p className="text-xs text-destructive font-body">Please check your phone number. It seems a bit off.</p>
              )}
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <Label className="font-body text-sm">City</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className={cn(
                  "h-12 rounded-xl font-body",
                  shakeFields.has("city") && "animate-shake border-destructive"
                )}>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  {CITIES.map((c) => (
                    <SelectItem key={c.value} value={c.value} className="font-body">{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {shakeFields.has("city") && (
                <p className="text-xs text-destructive font-body">Please select your city for delivery.</p>
              )}
            </div>

            {/* Area (Amman only) */}
            {city === "amman" && (
              <div className="space-y-1.5">
                <Label className="font-body text-sm">Area</Label>
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger className="h-12 rounded-xl font-body">
                    <SelectValue placeholder="Select your area" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50 max-h-60">
                    {AMMAN_AREAS.map((a) => (
                      <SelectItem key={a} value={a.toLowerCase().replace(/\s/g, "-")} className="font-body">{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Street Address */}
            <div className="space-y-1.5">
              <Label htmlFor="address" className="font-body text-sm">Street Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                placeholder="Building name, street, floor"
                className={cn(
                  "h-12 rounded-xl font-body",
                  shakeFields.has("address") && "animate-shake border-destructive"
                )}
              />
              {shakeFields.has("address") && (
                <p className="text-xs text-destructive font-body">We need your address to deliver your order.</p>
              )}
            </div>
          </section>

          {/* Payment Method */}
          <section className="space-y-4">
            <h2 className="font-heading text-lg text-foreground">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* COD */}
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={cn(
                  "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                  paymentMethod === "cod"
                    ? "border-accent bg-accent/5 shadow-maroon-glow"
                    : "border-border/50 hover:border-border"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Banknote className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-body font-semibold text-sm text-foreground">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">
                    Pay securely at your doorstep.
                  </p>
                </div>
              </button>

              {/* Credit Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                  paymentMethod === "card"
                    ? "border-accent bg-accent/5 shadow-maroon-glow"
                    : "border-border/50 hover:border-border"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <CreditCard className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-body font-semibold text-sm text-foreground">Credit / Debit Card</p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">
                    Secure payment via Shopify.
                  </p>
                </div>
              </button>
            </div>
          </section>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 btn-ripple text-sm uppercase tracking-widest rounded-xl"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : paymentMethod === "card" ? (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Pay with Card ({(totalPrice + deliveryFee).toFixed(2)} {currency})
              </>
            ) : (
              <>
                <Banknote className="h-4 w-4 mr-2" />
                Place Order — COD ({(totalPrice + deliveryFee).toFixed(2)} {currency})
              </>
            )}
          </Button>

          <p className="text-[10px] text-center text-muted-foreground font-body">
            By placing your order, you agree to Asper's Terms of Service and Return Policy.
          </p>
        </form>
      </main>
    </div>
  );
}
