"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  CreditCard,
  Heart,
  LogIn,
  LogOut,
  Package,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const AccountDropdown = ({ isScrolled }: { isScrolled: boolean }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isAr = language === "ar";
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(isAr ? "فشل تسجيل الخروج" : "Failed to sign out");
    } else {
      toast.success(isAr ? "تم تسجيل الخروج" : "Signed out successfully");
      navigate("/");
    }
  };

  // Get user display name from metadata or email
  const displayName = user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] || "Guest";
  const userEmail = user?.email || "";

  // Mock loyalty data - in production this would come from a profiles/loyalty table
  const loyaltyData = {
    tier: "Gold Member",
    points: 1250,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 text-foreground hover:text-primary transition-colors focus:outline-none">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
              isScrolled ? "bg-muted" : "bg-foreground/10",
            )}
          >
            <User className="h-4 w-4" />
          </div>
          <ChevronDown className="h-3 w-3 hidden md:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-0 rounded-none border-border"
      >
        {user
          ? (
            <>
              <DropdownMenuLabel className="p-0">
                {/* A. LOYALTY CARD HEADER (The Luxury Touch) */}
                <div className="bg-gradient-to-br from-luxury-black to-gray-800 text-white p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 bg-gold-400 text-luxury-black text-[9px] font-bold uppercase tracking-widest rounded-sm">
                        {loyaltyData.tier}
                      </span>
                      <p className="text-lg font-serif mt-2">{displayName}</p>
                      <p className="text-xs text-white/60 mt-0.5">
                        {userEmail}
                      </p>
                    </div>
                    <Sparkles className="h-5 w-5 text-gold-400" />
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/60">
                        {isAr ? "النقاط المتاحة" : "Available Rewards"}
                      </p>
                      <p className="text-xl font-bold">
                        {loyaltyData.points} pts
                      </p>
                    </div>
                    <button className="px-4 py-1.5 bg-gold-400 text-luxury-black text-[10px] font-bold uppercase tracking-widest hover:bg-gold-300 transition-colors">
                      {isAr ? "استبدال" : "Redeem"}
                    </button>
                  </div>
                </div>
              </DropdownMenuLabel>

              {/* B. NAVIGATION GROUPS */}
              <div className="p-2">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="py-3 px-3 cursor-pointer rounded-none hover:bg-cream"
                    onClick={() => navigate("/account?tab=orders")}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-gold-500" />
                        {isAr ? "طلباتك" : "Your Beauty Rituals (Orders)"}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="py-3 px-3 cursor-pointer rounded-none hover:bg-cream"
                    onClick={() => navigate("/wishlist")}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-3">
                        <Heart className="h-4 w-4 text-gold-500" />
                        {isAr ? "قائمة الأمنيات" : "The Wishlist"}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="py-3 px-3 cursor-pointer rounded-none hover:bg-cream"
                    onClick={() => navigate("/account?tab=payment")}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-3">
                        <CreditCard className="h-4 w-4 text-gold-500" />
                        {isAr ? "طرق الدفع" : "Saved Methods"}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="py-3 px-3 cursor-pointer rounded-none hover:bg-cream"
                    onClick={() => navigate("/account?tab=settings")}
                  >
                    <Settings className="h-4 w-4 mr-3 text-muted-foreground" />
                    {isAr ? "الإعدادات" : "Preferences"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="py-3 px-3 cursor-pointer rounded-none hover:bg-cream text-red-500"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    {isAr ? "تسجيل الخروج" : "Sign Out"}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </div>

              {/* C. FOOTER AD (iHerb Style Promotion) */}
              <div className="bg-cream p-4 border-t border-border">
                <p className="text-[11px] text-center text-muted-foreground">
                  {isAr
                    ? "احصلي على 10% مكافآت على كل عملية شراء. "
                    : "Earn 10% back on every purchase. "}
                  <Link
                    to="/rewards"
                    className="text-gold-500 font-bold hover:underline"
                  >
                    {isAr ? "اعرفي المزيد" : "Learn More"}
                  </Link>
                </p>
              </div>
            </>
          )
          : (
            /* Guest State - Not Logged In */
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-serif text-lg">
                  {isAr ? "مرحباً بك" : "Welcome"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isAr
                    ? "سجلي الدخول للوصول إلى حسابك"
                    : "Sign in to access your account"}
                </p>
              </div>

              <button
                onClick={() => navigate("/auth")}
                className="w-full py-3 bg-foreground text-background font-medium text-sm uppercase tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                {isAr ? "تسجيل الدخول" : "Sign In"}
              </button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                {isAr ? "ليس لديك حساب؟ " : "Don't have an account? "}
                <Link
                  to="/auth?mode=signup"
                  className="text-gold-500 font-medium hover:underline"
                >
                  {isAr ? "أنشئي حساباً" : "Create one"}
                </Link>
              </p>
            </div>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountDropdown;
