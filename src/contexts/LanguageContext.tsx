import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type Language = "en" | "ar";

interface Translations {
  // Navigation
  home: string;
  collections: string;
  shopByCategory: string;
  brands: string;
  bestSellers: string;
  offers: string;
  contactUs: string;
  search: string;
  cart: string;

  // Collections
  hairCare: string;
  bodyCare: string;
  makeUp: string;
  skincare: string;
  fragrances: string;
  toolsDevices: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;
  discoverCollections: string;
  scroll: string;

  // Products
  addToBag: string;
  addToCart: string;
  addedToBag: string;
  premiumProduct: string;
  noImage: string;
  quantity: string;
  selectSize: string;
  selectColor: string;
  inStock: string;
  outOfStock: string;

  // Cart
  shoppingCart: string;
  cartEmpty: string;
  itemsInCart: string;
  total: string;
  checkout: string;
  checkoutWithShopify: string;
  creatingCheckout: string;
  remove: string;

  // Footer
  navigation: string;
  customerCare: string;
  legal: string;
  stayConnected: string;
  subscribeText: string;
  yourEmail: string;
  subscribe: string;
  privacyPolicy: string;
  termsOfService: string;
  cookiePolicy: string;
  accessibility: string;
  shippingInfo: string;
  returnsExchanges: string;
  orderTracking: string;
  faq: string;
  newArrivals: string;
  giftSets: string;
  allRightsReserved: string;
  beautyShop: string;

  // Pages
  exploreCollections: string;
  discoverBrands: string;
  topSellers: string;
  specialOffers: string;
  getInTouch: string;
  loadingProducts: string;
  noProductsFound: string;
  backToHome: string;
  productNotFound: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    home: "Home",
    collections: "Collections",
    shopByCategory: "Shop By Category",
    brands: "Brands",
    bestSellers: "Best Sellers",
    offers: "Offers",
    contactUs: "Contact Us",
    search: "Search",
    cart: "Cart",

    // Collections
    hairCare: "Hair Care",
    bodyCare: "Body Care",
    makeUp: "Make Up",
    skincare: "Skincare",
    fragrances: "Fragrances",
    toolsDevices: "Tools & Devices",

    // Hero
    heroTitle: "Unbox Pure Indulgence",
    heroSubtitle:
      "Discover our curated collection of premium beauty boxes, crafted with the finest ingredients for discerning individuals.",
    discoverCollections: "Discover Collections",
    scroll: "Scroll",

    // Products
    addToBag: "Add to Bag",
    addToCart: "Add to Cart",
    addedToBag: "Added to bag",
    premiumProduct: "Premium beauty product",
    noImage: "No image",
    quantity: "Quantity",
    selectSize: "Select Size",
    selectColor: "Select Color",
    inStock: "In Stock",
    outOfStock: "Out of Stock",

    // Cart
    shoppingCart: "Shopping Cart",
    cartEmpty: "Your cart is empty",
    itemsInCart: "items in your cart",
    total: "Total",
    checkout: "Checkout",
    checkoutWithShopify: "Checkout with Shopify",
    creatingCheckout: "Creating Checkout...",
    remove: "Remove",

    // Footer
    navigation: "Navigation",
    customerCare: "Customer Care",
    legal: "Legal",
    stayConnected: "Stay Connected",
    subscribeText: "Subscribe to receive exclusive offers and updates.",
    yourEmail: "Your email",
    subscribe: "Subscribe",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    cookiePolicy: "Cookie Policy",
    accessibility: "Accessibility",
    shippingInfo: "Shipping Info",
    returnsExchanges: "Returns & Exchanges",
    orderTracking: "Order Tracking",
    faq: "FAQ",
    newArrivals: "New Arrivals",
    giftSets: "Gift Sets",
    allRightsReserved: "All rights reserved.",
    beautyShop: "Beauty Shop",

    // Pages
    exploreCollections: "Explore Collections",
    discoverBrands: "Discover Brands",
    topSellers: "Top Sellers",
    specialOffers: "Special Offers",
    getInTouch: "Get In Touch",
    loadingProducts: "Loading products...",
    noProductsFound: "No products found",
    backToHome: "Back to Home",
    productNotFound: "Product not found",
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    collections: "المجموعات",
    shopByCategory: "تسوق حسب الفئة",
    brands: "العلامات التجارية",
    bestSellers: "الأكثر مبيعاً",
    offers: "العروض",
    contactUs: "اتصل بنا",
    search: "بحث",
    cart: "السلة",

    // Collections
    hairCare: "العناية بالشعر",
    bodyCare: "العناية بالجسم",
    makeUp: "المكياج",
    skincare: "العناية بالبشرة",
    fragrances: "العطور",
    toolsDevices: "الأدوات والأجهزة",

    // Hero
    heroTitle: "افتح صندوق الفخامة",
    heroSubtitle:
      "اكتشف مجموعتنا المختارة من صناديق التجميل الفاخرة، المصنوعة بأجود المكونات للأفراد المميزين.",
    discoverCollections: "اكتشف المجموعات",
    scroll: "مرر",

    // Products
    addToBag: "أضف إلى الحقيبة",
    addToCart: "أضف إلى السلة",
    addedToBag: "تمت الإضافة",
    premiumProduct: "منتج تجميل فاخر",
    noImage: "لا توجد صورة",
    quantity: "الكمية",
    selectSize: "اختر الحجم",
    selectColor: "اختر اللون",
    inStock: "متوفر",
    outOfStock: "غير متوفر",

    // Cart
    shoppingCart: "سلة التسوق",
    cartEmpty: "سلتك فارغة",
    itemsInCart: "منتجات في سلتك",
    total: "المجموع",
    checkout: "الدفع",
    checkoutWithShopify: "الدفع عبر شوبيفاي",
    creatingCheckout: "جاري إنشاء الطلب...",
    remove: "إزالة",

    // Footer
    navigation: "التنقل",
    customerCare: "خدمة العملاء",
    legal: "قانوني",
    stayConnected: "ابقَ على تواصل",
    subscribeText: "اشترك لتلقي العروض الحصرية والتحديثات.",
    yourEmail: "بريدك الإلكتروني",
    subscribe: "اشترك",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    cookiePolicy: "سياسة ملفات تعريف الارتباط",
    accessibility: "إمكانية الوصول",
    shippingInfo: "معلومات الشحن",
    returnsExchanges: "الإرجاع والاستبدال",
    orderTracking: "تتبع الطلب",
    faq: "الأسئلة الشائعة",
    newArrivals: "وصل حديثاً",
    giftSets: "مجموعات الهدايا",
    allRightsReserved: "جميع الحقوق محفوظة.",
    beautyShop: "متجر التجميل",

    // Pages
    exploreCollections: "استكشف المجموعات",
    discoverBrands: "اكتشف العلامات التجارية",
    topSellers: "الأكثر مبيعاً",
    specialOffers: "عروض خاصة",
    getInTouch: "تواصل معنا",
    loadingProducts: "جاري تحميل المنتجات...",
    noProductsFound: "لم يتم العثور على منتجات",
    backToHome: "العودة للرئيسية",
    productNotFound: "المنتج غير موجود",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("asper-language");
    return (saved as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("asper-language", lang);
  };

  const isRTL = language === "ar";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: translations[language], isRTL }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
