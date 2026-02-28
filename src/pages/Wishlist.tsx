import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateTitle } from "@/lib/productUtils";
import { formatJOD } from "@/lib/productImageUtils";
import { ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Wishlist() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);

  const handleAddToCart = (product: typeof items[0]) => {
    const firstVariant = product.node.variants.edges[0]?.node;
    if (!firstVariant) return;

    addToCart({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
    });

    toast.success(isAr ? "تمت الإضافة للحقيبة" : "Added to Bag", {
      description: product.node.title,
      position: "top-center",
    });

    removeItem(product.node.id);
    setCartOpen(true);
  };

  const handleAddAllToCart = () => {
    items.forEach((product) => {
      const firstVariant = product.node.variants.edges[0]?.node;
      if (firstVariant) {
        addToCart({
          product,
          variantId: firstVariant.id,
          variantTitle: firstVariant.title,
          price: firstVariant.price,
          quantity: 1,
          selectedOptions: firstVariant.selectedOptions,
        });
      }
    });

    toast.success(isAr ? "تمت إضافة جميع المنتجات" : "All items added to bag", {
      position: "top-center",
    });

    clearWishlist();
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-40 pb-20">
        <div className="luxury-container">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
              <Heart className="w-8 h-8 text-gold fill-gold" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">
              {isAr
                ? (
                  <>
                    قائمة <span className="text-gold">الرغبات</span>
                  </>
                )
                : (
                  <>
                    My <span className="text-gold">Wishlist</span>
                  </>
                )}
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
            <p className="font-body text-cream/60 max-w-2xl mx-auto">
              {isAr
                ? "منتجاتك المفضلة محفوظة هنا لشرائها لاحقاً."
                : "Your favorite products saved for later."}
            </p>
          </div>

          {items.length === 0
            ? (
              /* Empty State */
              <div className="text-center py-20">
                <div className="w-32 h-32 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center mx-auto mb-8">
                  <Heart className="w-16 h-16 text-gold/30" />
                </div>
                <h2 className="font-display text-2xl text-cream mb-4">
                  {isAr ? "قائمة الرغبات فارغة" : "Your wishlist is empty"}
                </h2>
                <p className="font-body text-cream/60 mb-8 max-w-md mx-auto">
                  {isAr
                    ? "ابدأي بإضافة منتجاتك المفضلة عن طريق النقر على أيقونة القلب في أي منتج."
                    : "Start adding your favorite products by clicking the heart icon on any product."}
                </p>
                <Link to="/collections">
                  <Button className="bg-gold text-background hover:bg-gold-light font-display tracking-wider">
                    {isAr ? "تصفح المجموعات" : "Browse Collections"}
                    <ArrowRight className="w-4 h-4 ms-2" />
                  </Button>
                </Link>
              </div>
            )
            : (
              <>
                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-4 bg-secondary/30 border border-gold/10">
                  <p className="font-body text-cream/80">
                    {isAr
                      ? `${items.length} ${
                        items.length === 1 ? "منتج محفوظ" : "منتجات محفوظة"
                      }`
                      : `${items.length} item${
                        items.length !== 1 ? "s" : ""
                      } saved`}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gold/30 text-cream hover:bg-gold/10"
                      onClick={clearWishlist}
                    >
                      <Trash2 className="w-4 h-4 me-2" />
                      {isAr ? "مسح الكل" : "Clear All"}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gold text-background hover:bg-gold-light"
                      onClick={handleAddAllToCart}
                    >
                      <ShoppingBag className="w-4 h-4 me-2" />
                      {isAr ? "إضافة الكل للحقيبة" : "Add All to Bag"}
                    </Button>
                  </div>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((product) => {
                    const firstImage = product.node.images.edges[0]?.node;
                    const price = product.node.priceRange.minVariantPrice;

                    return (
                      <div
                        key={product.node.id}
                        className="group bg-secondary/20 border border-gold/10 hover:border-gold/30 transition-all duration-400 overflow-hidden"
                      >
                        {/* Image */}
                        <Link
                          to={`/product/${product.node.handle}`}
                          className="block aspect-square relative overflow-hidden bg-cream/5"
                        >
                          {firstImage
                            ? (
                              <img
                                src={firstImage.url}
                                alt={firstImage.altText || product.node.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            )
                            : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Heart className="w-12 h-12 text-gold/20" />
                              </div>
                            )}

                          {/* Remove Button Overlay */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              removeItem(product.node.id);
                            }}
                            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-gold/30 flex items-center justify-center text-cream hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </Link>

                        {/* Details */}
                        <div className="p-4">
                          <Link
                            to={`/product/${product.node.handle}`}
                            className="font-display text-sm text-cream hover:text-gold transition-colors line-clamp-2 mb-2 block"
                          >
                            {translateTitle(product.node.title, language)}
                          </Link>

                          <p className="font-display text-gold text-lg mb-4">
                            {formatJOD(parseFloat(price.amount))}
                          </p>

                          <Button
                            size="sm"
                            className="w-full bg-gold text-background hover:bg-gold-light font-display text-xs tracking-wider"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingBag className="w-3.5 h-3.5 me-2" />
                            {isAr ? "أضف للحقيبة" : "Add to Bag"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Continue Shopping */}
                <div className="text-center mt-12">
                  <Link to="/collections">
                    <Button
                      variant="outline"
                      className="border-gold/30 text-cream hover:bg-gold/10 hover:border-gold font-display tracking-wider"
                    >
                      {isAr ? "متابعة التسوق" : "Continue Shopping"}
                      <ArrowRight className="w-4 h-4 ms-2" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
