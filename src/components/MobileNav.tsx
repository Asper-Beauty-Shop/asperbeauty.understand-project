import { Heart, Home, Search, ShoppingBag, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

export const MobileNav = () => {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const setCartOpen = useCartStore((state) => state.setOpen);

  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-polished-white/90 backdrop-blur-lg border-t border-asper-stone py-3 px-6 flex justify-between items-center lg:hidden">
      <Link
        to="/"
        className={`flex flex-col items-center gap-1 ${
          isActive("/") ? "text-polished-gold" : "text-asper-stone-dark"
        }`}
      >
        <Home className="h-5 w-5" />
        <span className="text-[8px] uppercase tracking-tighter font-bold">
          Home
        </span>
      </Link>

      <Link
        to="/shop"
        className={`flex flex-col items-center gap-1 ${
          isActive("/shop") ? "text-polished-gold" : "text-asper-stone-dark"
        }`}
      >
        <Search className="h-5 w-5" />
        <span className="text-[8px] uppercase tracking-tighter font-bold">
          Search
        </span>
      </Link>

      <Link
        to="/wishlist"
        className={`flex flex-col items-center gap-1 relative ${
          isActive("/wishlist") ? "text-polished-gold" : "text-asper-stone-dark"
        }`}
      >
        <Heart className="h-5 w-5" />
        {wishlistItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-asper-ink text-polished-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center">
            {wishlistItems.length}
          </span>
        )}
        <span className="text-[8px] uppercase tracking-tighter font-bold">
          Wishlist
        </span>
      </Link>

      <button
        onClick={() => setCartOpen(true)}
        className="flex flex-col items-center gap-1 text-asper-stone-dark relative"
      >
        <ShoppingBag className="h-5 w-5" />
        {totalCartItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-asper-ink text-polished-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center">
            {totalCartItems}
          </span>
        )}
        <span className="text-[8px] uppercase tracking-tighter font-bold">
          Bag
        </span>
      </button>

      <Link
        to="/account"
        className={`flex flex-col items-center gap-1 ${
          isActive("/account") ? "text-polished-gold" : "text-asper-stone-dark"
        }`}
      >
        <User className="h-5 w-5" />
        <span className="text-[8px] uppercase tracking-tighter font-bold">
          Profile
        </span>
      </Link>
    </div>
  );
};

export default MobileNav;

