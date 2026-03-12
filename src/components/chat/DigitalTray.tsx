import { motion } from "framer-motion";
import { type PrescriptionProduct, useCartStore } from "@/stores/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { logPrescriptionAddToCart } from "@/lib/conciergeAnalytics";
import { RoutineSaver } from "./RoutineSaver";
import { Plus } from "lucide-react";

export interface DigitalTrayProduct extends PrescriptionProduct {
  id: string;
  title: string;
  price: number;
  image_url?: string | null;
  brand?: string | null;
  category?: string | null;
  handle?: string | null;
}

interface DigitalTrayProps {
  products: DigitalTrayProduct[];
  concern?: string;
  persona?: "dr_sami" | "ms_zain";
}

export const DigitalTray = ({ products, concern, persona = "dr_sami" }: DigitalTrayProps) => {
  const { language } = useLanguage();
  const addMultipleFromPrescription = useCartStore((s) => s.addMultipleFromPrescription);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const isArabic = language === "ar";
  const accentHex = persona === "ms_zain" ? "#D4AF37" : "#800020";
  const accentBg = persona === "ms_zain" ? "bg-[#D4AF37]" : "bg-[#800020]";
  const accentText = persona === "ms_zain" ? "text-[#D4AF37]" : "text-[#800020]";
  const buttonHover = persona === "ms_zain" ? "hover:bg-[#D4AF37]" : "hover:bg-[#800020]";

  const handleQuickAddRoutine = async () => {
    if (!products.length) return;
    products.forEach((p) => logPrescriptionAddToCart(p.id, "prescription_cta"));
    await addMultipleFromPrescription(products);
    toast.success(
      isArabic ? "تمت إضافة الروتين إلى السلة" : "Routine added to cart",
      {
        description: isArabic
          ? `${products.length} منتج — افتح السلة للاطلاع`
          : `${products.length} items — open cart to review`,
        position: "top-center",
      },
    );
  };

  const handleSingleAdd = (p: DigitalTrayProduct) => {
    const cartProduct = {
      node: {
        id: p.id,
        title: p.title,
        handle: p.handle || p.id,
        vendor: p.brand || "",
        images: { edges: p.image_url ? [{ node: { url: p.image_url } }] : [] },
        priceRange: { minVariantPrice: { amount: p.price.toString(), currencyCode: "JOD" } }
      }
    };
    
    addItem({
      product: cartProduct as any,
      variantId: `${p.id}-default`,
      variantTitle: "Default",
      price: { amount: p.price.toString(), currencyCode: "JOD" },
      quantity: 1,
      selectedOptions: []
    });
    toast.success(isArabic ? "تمت الإضافة" : "Added to Regimen");
  };

  const totalJOD = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="w-full mt-4 mb-2 overflow-hidden">
      <div className="flex justify-between items-center mb-3 px-1">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
          {isArabic ? "البروتوكول الموصى به" : "Recommended Protocol"}
        </p>
        <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">
          {products.length} {isArabic ? "منتجات" : "Items"}
        </span>
      </div>
      
      {/* Horizontal Snap-Scroll Digital Tray */}
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
        {products.map((p, index) => (
          <motion.div 
            key={p.id || index}
            className="flex-none w-48 bg-white rounded-xl p-3 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.04)] snap-start animate-clinical-reveal flex flex-col relative"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            {/* Persona Accent Indicator */}
            <div className={`absolute top-0 left-0 w-full h-1 rounded-t-xl ${accentBg} opacity-80`}></div>

            {/* Product Image */}
            <div className="h-28 w-full bg-[#F8F8FF] rounded-lg mb-3 flex items-center justify-center overflow-hidden">
              {p.image_url ? (
                <img 
                  src={p.image_url} 
                  alt={p.title}
                  className="max-h-full object-contain mix-blend-multiply hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-100" />
                </div>
              )}
            </div>

            {/* Product Data */}
            <div className="flex-1 flex flex-col min-w-0">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 line-clamp-1">
                {p.brand}
              </span>
              <h4 className="text-xs font-bold text-gray-900 leading-snug mb-2 line-clamp-2 min-h-[2.5em]">
                {p.title}
              </h4>
              <div className="mt-auto flex items-center justify-between">
                <span className={`text-xs font-extrabold ${accentText}`}>
                  {p.price.toFixed(2)} JOD
                </span>
                
                {/* Micro-Conversion Button */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleSingleAdd(p);
                  }}
                  className={`w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center transition-all duration-300 ${buttonHover} hover:text-white hover:scale-110 shadow-sm`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tray Footer & Bulk Actions */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-2 flex flex-col gap-2"
      >
        <div className="flex justify-between items-center px-1 py-2 border-t border-gray-100">
          <span className="text-[10px] text-gray-400 font-medium">
            {isArabic ? "المجموع المقدّر:" : "Approx. total:"}
          </span>
          <span className={`text-sm font-bold ${accentText}`}>
            {totalJOD.toFixed(2)} JOD
          </span>
        </div>

        <button
          type="button"
          onClick={handleQuickAddRoutine}
          disabled={isLoading}
          className={`w-full ${accentBg} text-white py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 transform active:scale-[0.98]`}
        >
          {isLoading
            ? (isArabic ? "جاري الإضافة..." : "Processing...")
            : (isArabic ? "إضافة الروتين كاملاً" : "Add Full Regimen to Cart")}
        </button>

        <RoutineSaver 
          products={products.map(p => ({ id: p.id, title: p.title, price: p.price }))}
          concern={concern}
        />
      </motion.div>
    </div>
  );
};
