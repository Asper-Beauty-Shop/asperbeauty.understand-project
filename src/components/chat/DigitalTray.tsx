import { motion } from "framer-motion";
import { type PrescriptionProduct, useCartStore } from "@/stores/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { logPrescriptionAddToCart } from "@/lib/conciergeAnalytics";

export interface DigitalTrayProduct extends PrescriptionProduct {
  id: string;
  title: string;
  price: number;
  image_url?: string | null;
  brand?: string | null;
  category?: string | null;
}

interface DigitalTrayProps {
  products: DigitalTrayProduct[];
}

export const DigitalTray = ({ products }: DigitalTrayProps) => {
  const { language } = useLanguage();
  const addMultipleFromPrescription = useCartStore(
    (s) => s.addMultipleFromPrescription,
  );
  const isLoading = useCartStore((s) => s.isLoading);

  const handleQuickAddRoutine = async () => {
    if (!products.length) return;
    products.forEach((p) => logPrescriptionAddToCart(p.id, "prescription_cta"));
    await addMultipleFromPrescription(products);
    toast.success(
      language === "ar"
        ? "تمت إضافة الروتين إلى السلة"
        : "Routine added to cart",
      {
        description: language === "ar"
          ? `${products.length} منتج — افتح السلة للاطلاع`
          : `${products.length} items — open cart to review`,
        position: "top-center",
      },
    );
  };

  const totalJOD = products.reduce((sum, p) => sum + p.price, 0);
  const isRTL = language === "ar";

  return (
    <motion.div
      initial={{ x: isRTL ? -100 : 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
      className={`bg-white p-6 rounded-xl shadow-xl mt-3 ${
        isRTL ? "border-r-4 border-shiny-gold" : "border-l-4 border-shiny-gold"
      }`}
    >
      <h3
        className="font-display text-burgundy text-xl mb-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {language === "ar" ? "روتينك الموصى به" : "Your Prescription"}
      </h3>
      <div className="space-y-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="w-12 h-12 rounded-lg bg-cream/50 overflow-hidden flex-shrink-0">
              {p.image_url
                ? (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                )
                : <div className="w-full h-full bg-gold/10" />}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-body text-sm text-dark-charcoal line-clamp-2">
                {p.title}
              </span>
              {p.brand && (
                <span className="text-xs text-gold font-body block mt-0.5">
                  {p.brand}
                </span>
              )}
            </div>
            <span className="font-display text-burgundy font-semibold text-sm shrink-0">
              {p.price} JOD
            </span>
          </div>
        ))}
      </div>
      <p className="text-sm text-dark-charcoal/80 font-body mt-4">
        {language === "ar" ? "المجموع التقريبي:" : "Approx. total:"}{" "}
        <span className="font-display text-burgundy font-semibold">
          {totalJOD.toFixed(2)} JOD
        </span>
      </p>
      <button
        type="button"
        onClick={handleQuickAddRoutine}
        disabled={isLoading}
        className="w-full mt-6 bg-burgundy text-white py-3 font-body font-medium rounded-lg hover:bg-burgundy-light transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading
          ? (language === "ar" ? "جاري الإضافة..." : "Adding...")
          : (language === "ar"
            ? "إضافة الروتين إلى السلة"
            : "Quick Add Routine to Cart")}
      </button>
      <p
        className="text-center text-[10px] text-gray-400 mt-2 italic font-body"
        dir={isRTL ? "rtl" : "ltr"}
      >
        *{language === "ar"
          ? "تركيبة سريرية من صيدلي آسبر الرقمي"
          : "Clinical formulation by Asper Digital Pharmacist"}
      </p>
    </motion.div>
  );
};
