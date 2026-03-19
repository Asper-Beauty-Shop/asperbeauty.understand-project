import { Sparkles } from "lucide-react";

const PromoHeader = () => {
  return (
    <div className="w-full py-3 text-center text-polished-white font-medium text-sm bg-gradient-to-r from-burgundy-dark to-burgundy">
      <div className="flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4" />
        <span>Special Offer: Up to 50% OFF on Selected Items | Free Shipping on Orders Over $75</span>
        <Sparkles className="w-4 h-4" />
      </div>
    </div>
  );
};

export default PromoHeader;