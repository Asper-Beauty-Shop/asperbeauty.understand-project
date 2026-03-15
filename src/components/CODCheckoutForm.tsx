import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  CheckCircle,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { translateTitle } from "@/lib/productUtils";
import { z } from "zod";
import HCaptcha from "@hcaptcha/react-hcaptcha";

// hCaptcha site key from environment variable (falls back to test key for development)
const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY ||
  "10000000-ffff-ffff-ffff-000000000001";

// Validation schema
const orderFormSchema = z.object({
  customerName: z.string().trim().min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),
  customerPhone: z.string().trim().regex(
    /^07[789]\d{7}$/,
    "Invalid phone number format (07XXXXXXXX)",
  ),
  customerEmail: z.string().email("Invalid email").max(255).optional().or(
    z.literal(""),
  ),
  deliveryAddress: z.string().trim().min(
    10,
    "Address must be at least 10 characters",
  ).max(500, "Address too long"),
  city: z.string().min(1, "Please select a city"),
  notes: z.string().trim().max(500, "Notes too long").optional().or(
    z.literal(""),
  ),
});
const JORDAN_CITIES = [
  "Amman",
  "Zarqa",
  "Irbid",
  "Aqaba",
  "Salt",
  "Mafraq",
  "Jerash",
  "Madaba",
  "Karak",
  "Ajloun",
  "Ma'an",
  "Tafilah",
];

const SHIPPING_COST = 3; // JOD
const FREE_SHIPPING_THRESHOLD = 50; // JOD

interface CODCheckoutFormProps {
  onSuccess: (orderNumber: string) => void;
  onCancel: () => void;
}

export const CODCheckoutForm = (
  { onSuccess, onCancel }: CODCheckoutFormProps,
) => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    city: "",
    notes: "",
  });

  const subtotal = getTotalPrice();
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const result = orderFormSchema.safeParse(formData);
    if (!result.success) {
      const firstError = result.error.issues[0];
      toast.error(firstError.message);
      return false;
    }
    return true;
  };

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (items.length === 0) {
      toast.error(isArabic ? "سلة التسوق فارغة" : "Cart is empty");
      return;
    }
    if (!captchaToken) {
      toast.error(
        isArabic
          ? "يرجى التحقق من أنك لست روبوت"
          : "Please verify you're not a robot",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current session for user_id binding
      const { data: { session } } = await supabase.auth.getSession();

      // Prepare order items with sanitized data
      const orderItems = items.map((item) => ({
        productId: String(item.product.node.id).slice(0, 100),
        productTitle: String(item.product.node.title).slice(0, 200),
        variantId: String(item.variantId).slice(0, 100),
        variantTitle: item.variantTitle
          ? String(item.variantTitle).slice(0, 100)
          : undefined,
        price: String(item.price.amount),
        currency: String(item.price.currencyCode),
        quantity: Math.min(Math.max(1, item.quantity), 99),
        selectedOptions: item.selectedOptions || {},
        imageUrl: item.product.node.images?.edges?.[0]?.node?.url || null,
      }));

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      // Call secure edge function with CAPTCHA token
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-cod-order`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            customerName: formData.customerName.trim(),
            customerPhone: formData.customerPhone.trim(),
            customerEmail: formData.customerEmail.trim() || "",
            deliveryAddress: formData.deliveryAddress.trim(),
            city: formData.city,
            notes: formData.notes.trim() || "",
            items: orderItems,
            subtotal: subtotal,
            shippingCost: shippingCost,
            total: total,
            captchaToken: captchaToken,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        // Reset captcha on error
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
        throw new Error(result.error || "Failed to create order");
      }

      clearCart();
      onSuccess(result.orderNumber);
    } catch (error) {
      console.error("Failed to place COD order:", error);
      toast.error(
        isArabic
          ? "فشل في إرسال الطلب. حاول مرة أخرى."
          : "Failed to place order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-[#F8F8FF]/50 rounded-lg p-4 space-y-3">
        <h3 className="font-display text-sm font-medium text-foreground">
          {isArabic ? "ملخص الطلب" : "Order Summary"}
        </h3>

        <div className="space-y-2 max-h-32 overflow-y-auto">
          {items.map((item) => (
            <div key={item.variantId} className="flex justify-between text-sm">
              <span className="text-muted-foreground truncate max-w-[200px]">
                {translateTitle(item.product.node.title, language)} ×{" "}
                {item.quantity}
              </span>
              <span className="text-foreground font-medium">
                {(parseFloat(item.price.amount) * item.quantity).toFixed(2)} JOD
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-[#C5A028]/20 pt-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {isArabic ? "المجموع الفرعي" : "Subtotal"}
            </span>
            <span>{subtotal.toFixed(2)} JOD</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {isArabic ? "الشحن" : "Shipping"}
            </span>
            <span className={shippingCost === 0 ? "text-green-600" : ""}>
              {shippingCost === 0
                ? (isArabic ? "مجاني" : "Free")
                : `${shippingCost.toFixed(2)} JOD`}
            </span>
          </div>
          <div className="flex justify-between font-display text-base font-bold pt-1">
            <span>{isArabic ? "الإجمالي" : "Total"}</span>
            <span className="text-[#800020]">{total.toFixed(2)} JOD</span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="customerName"
            className="flex items-center gap-2 text-sm"
          >
            <User className="w-4 h-4 text-[#C5A028]" />
            {isArabic ? "الاسم الكامل" : "Full Name"} *
          </Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => handleInputChange("customerName", e.target.value)}
            placeholder={isArabic ? "أدخل اسمك الكامل" : "Enter your full name"}
            className="border-[#C5A028]/30 focus:border-[#C5A028]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="customerPhone"
            className="flex items-center gap-2 text-sm"
          >
            <Phone className="w-4 h-4 text-[#C5A028]" />
            {isArabic ? "رقم الهاتف" : "Phone Number"} *
          </Label>
          <Input
            id="customerPhone"
            type="tel"
            value={formData.customerPhone}
            onChange={(e) => handleInputChange("customerPhone", e.target.value)}
            placeholder={isArabic ? "07XXXXXXXX" : "07XXXXXXXX"}
            className="border-[#C5A028]/30 focus:border-[#C5A028]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="customerEmail"
            className="flex items-center gap-2 text-sm"
          >
            <Mail className="w-4 h-4 text-[#C5A028]" />
            {isArabic ? "البريد الإلكتروني" : "Email"}{" "}
            ({isArabic ? "اختياري" : "optional"})
          </Label>
          <Input
            id="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => handleInputChange("customerEmail", e.target.value)}
            placeholder={isArabic ? "example@email.com" : "example@email.com"}
            className="border-[#C5A028]/30 focus:border-[#C5A028]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-[#C5A028]" />
            {isArabic ? "المدينة" : "City"} *
          </Label>
          <Select
            value={formData.city}
            onValueChange={(value) => handleInputChange("city", value)}
          >
            <SelectTrigger className="border-[#C5A028]/30 focus:border-[#C5A028]">
              <SelectValue
                placeholder={isArabic ? "اختر المدينة" : "Select city"}
              />
            </SelectTrigger>
            <SelectContent>
              {JORDAN_CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="deliveryAddress"
            className="flex items-center gap-2 text-sm"
          >
            <MapPin className="w-4 h-4 text-[#C5A028]" />
            {isArabic ? "عنوان التوصيل" : "Delivery Address"} *
          </Label>
          <Textarea
            id="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={(e) =>
              handleInputChange("deliveryAddress", e.target.value)}
            placeholder={isArabic
              ? "أدخل عنوان التوصيل بالتفصيل"
              : "Enter detailed delivery address"}
            className="border-[#C5A028]/30 focus:border-[#C5A028] min-h-[80px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-[#C5A028]" />
            {isArabic ? "ملاحظات" : "Notes"}{" "}
            ({isArabic ? "اختياري" : "optional"})
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder={isArabic
              ? "أي ملاحظات إضافية للتوصيل"
              : "Any additional delivery notes"}
            className="border-[#C5A028]/30 focus:border-[#C5A028] min-h-[60px]"
          />
        </div>
      </div>

      {/* CAPTCHA Verification */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm">
          <ShieldCheck className="w-4 h-4 text-[#C5A028]" />
          {isArabic ? "التحقق الأمني" : "Security Verification"} *
        </Label>
        <div className="flex justify-center bg-[#F8F8FF]/30 rounded-lg p-3">
          <HCaptcha
            ref={captchaRef}
            sitekey={HCAPTCHA_SITE_KEY}
            onVerify={handleCaptchaVerify}
            onExpire={handleCaptchaExpire}
            languageOverride={isArabic ? "ar" : "en"}
          />
        </div>
        {captchaToken && (
          <p className="text-xs text-green-600 flex items-center gap-1 justify-center">
            <CheckCircle className="w-3 h-3" />
            {isArabic ? "تم التحقق بنجاح" : "Verified successfully"}
          </p>
        )}
      </div>

      {/* COD Notice */}
      <div className="bg-[#C5A028]/10 border border-[#C5A028]/30 rounded-lg p-3 text-center">
        <p className="text-sm text-foreground font-medium">
          💵 {isArabic ? "الدفع عند الاستلام" : "Cash on Delivery"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {isArabic
            ? "ادفع نقداً عند استلام طلبك"
            : "Pay cash when you receive your order"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-[#C5A028]/30"
          disabled={isSubmitting}
        >
          {isArabic ? "إلغاء" : "Cancel"}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || items.length === 0 || !captchaToken}
          className="flex-1 bg-[#800020] hover:bg-[#800020]-light text-white"
        >
          {isSubmitting
            ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {isArabic ? "جاري الإرسال..." : "Placing Order..."}
              </span>
            )
            : (
              isArabic ? "تأكيد الطلب" : "Confirm Order"
            )}
        </Button>
      </div>
    </form>
  );
};

// Order Success Component
export const OrderSuccess = (
  { orderNumber, onClose }: { orderNumber: string; onClose: () => void },
) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <div className="text-center py-6 space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>

      <div>
        <h3 className="font-display text-xl font-bold text-foreground">
          {isArabic ? "تم استلام طلبك!" : "Order Received!"}
        </h3>
        <p className="text-muted-foreground mt-1">
          {isArabic ? "شكراً لطلبك" : "Thank you for your order"}
        </p>
      </div>

      <div className="bg-[#F8F8FF]/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          {isArabic ? "رقم الطلب" : "Order Number"}
        </p>
        <p className="font-display text-lg font-bold text-[#800020]">
          {orderNumber}
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        {isArabic
          ? "سنتواصل معك قريباً لتأكيد طلبك"
          : "We will contact you soon to confirm your order"}
      </p>

      <Button
        onClick={onClose}
        className="w-full bg-[#800020] hover:bg-[#800020]-light text-white"
      >
        {isArabic ? "متابعة التسوق" : "Continue Shopping"}
      </Button>
    </div>
  );
};


