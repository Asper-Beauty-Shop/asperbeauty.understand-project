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
    home: "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©",
    collections: "Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø§Øª",
    shopByCategory: "ØªØ³ÙˆÙ‚ Ø­Ø³Ø¨ Ø§Ù„ÙØ¦Ø©",
    brands: "Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©",
    bestSellers: "Ø§Ù„Ø£ÙƒØ«Ø± Ù…Ø¨ÙŠØ¹Ø§Ù‹",
    offers: "Ø§Ù„Ø¹Ø±ÙˆØ¶",
    contactUs: "Ø§ØªØµÙ„ Ø¨Ù†Ø§",
    search: "Ø¨Ø­Ø«",
    cart: "Ø§Ù„Ø³Ù„Ø©",

    // Collections
    hairCare: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø´Ø¹Ø±",
    bodyCare: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¬Ø³Ù…",
    makeUp: "Ø§Ù„Ù…ÙƒÙŠØ§Ø¬",
    skincare: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©",
    fragrances: "Ø§Ù„Ø¹Ø·ÙˆØ±",
    toolsDevices: "Ø§Ù„Ø£Ø¯ÙˆØ§Øª ÙˆØ§Ù„Ø£Ø¬Ù‡Ø²Ø©",

    // Hero
    heroTitle: "Ø§ÙØªØ­ ØµÙ†Ø¯ÙˆÙ‚ Ø§Ù„ÙØ®Ø§Ù…Ø©",
    heroSubtitle:
      "Ø§ÙƒØªØ´Ù Ù…Ø¬Ù…ÙˆØ¹ØªÙ†Ø§ Ø§Ù„Ù…Ø®ØªØ§Ø±Ø© Ù…Ù† ØµÙ†Ø§Ø¯ÙŠÙ‚ Ø§Ù„ØªØ¬Ù…ÙŠÙ„ Ø§Ù„ÙØ§Ø®Ø±Ø©ØŒ Ø§Ù„Ù…ØµÙ†ÙˆØ¹Ø© Ø¨Ø£Ø¬ÙˆØ¯ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ù„Ù„Ø£ÙØ±Ø§Ø¯ Ø§Ù„Ù…Ù…ÙŠØ²ÙŠÙ†.",
    discoverCollections: "Ø§ÙƒØªØ´Ù Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø§Øª",
    scroll: "Ù…Ø±Ø±",

    // Products
    addToBag: "Ø£Ø¶Ù Ø¥Ù„Ù‰ Ø§Ù„Ø­Ù‚ÙŠØ¨Ø©",
    addToCart: "Ø£Ø¶Ù Ø¥Ù„Ù‰ Ø§Ù„Ø³Ù„Ø©",
    addedToBag: "ØªÙ…Øª Ø§Ù„Ø¥Ø¶Ø§ÙØ©",
    premiumProduct: "Ù…Ù†ØªØ¬ ØªØ¬Ù…ÙŠÙ„ ÙØ§Ø®Ø±",
    noImage: "Ù„Ø§ ØªÙˆØ¬Ø¯ ØµÙˆØ±Ø©",
    quantity: "Ø§Ù„ÙƒÙ…ÙŠØ©",
    selectSize: "Ø§Ø®ØªØ± Ø§Ù„Ø­Ø¬Ù…",
    selectColor: "Ø§Ø®ØªØ± Ø§Ù„Ù„ÙˆÙ†",
    inStock: "Ù…ØªÙˆÙØ±",
    outOfStock: "ØºÙŠØ± Ù…ØªÙˆÙØ±",

    // Cart
    shoppingCart: "Ø³Ù„Ø© Ø§Ù„ØªØ³ÙˆÙ‚",
    cartEmpty: "Ø³Ù„ØªÙƒ ÙØ§Ø±ØºØ©",
    itemsInCart: "Ù…Ù†ØªØ¬Ø§Øª ÙÙŠ Ø³Ù„ØªÙƒ",
    total: "Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹",
    checkout: "Ø§Ù„Ø¯ÙØ¹",
    checkoutWithShopify: "Ø§Ù„Ø¯ÙØ¹ Ø¹Ø¨Ø± Ø´ÙˆØ¨ÙŠÙØ§ÙŠ",
    creatingCheckout: "Ø¬Ø§Ø±ÙŠ Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø·Ù„Ø¨...",
    remove: "Ø¥Ø²Ø§Ù„Ø©",

    // Footer
    navigation: "Ø§Ù„ØªÙ†Ù‚Ù„",
    customerCare: "Ø®Ø¯Ù…Ø© Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡",
    legal: "Ù‚Ø§Ù†ÙˆÙ†ÙŠ",
    stayConnected: "Ø§Ø¨Ù‚ÙŽ Ø¹Ù„Ù‰ ØªÙˆØ§ØµÙ„",
    subscribeText: "Ø§Ø´ØªØ±Ùƒ Ù„ØªÙ„Ù‚ÙŠ Ø§Ù„Ø¹Ø±ÙˆØ¶ Ø§Ù„Ø­ØµØ±ÙŠØ© ÙˆØ§Ù„ØªØ­Ø¯ÙŠØ«Ø§Øª.",
    yourEmail: "Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ",
    subscribe: "Ø§Ø´ØªØ±Ùƒ",
    privacyPolicy: "Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©",
    termsOfService: "Ø´Ø±ÙˆØ· Ø§Ù„Ø®Ø¯Ù…Ø©",
    cookiePolicy: "Ø³ÙŠØ§Ø³Ø© Ù…Ù„ÙØ§Øª ØªØ¹Ø±ÙŠÙ Ø§Ù„Ø§Ø±ØªØ¨Ø§Ø·",
    accessibility: "Ø¥Ù…ÙƒØ§Ù†ÙŠØ© Ø§Ù„ÙˆØµÙˆÙ„",
    shippingInfo: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø´Ø­Ù†",
    returnsExchanges: "Ø§Ù„Ø¥Ø±Ø¬Ø§Ø¹ ÙˆØ§Ù„Ø§Ø³ØªØ¨Ø¯Ø§Ù„",
    orderTracking: "ØªØªØ¨Ø¹ Ø§Ù„Ø·Ù„Ø¨",
    faq: "Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø´Ø§Ø¦Ø¹Ø©",
    newArrivals: "ÙˆØµÙ„ Ø­Ø¯ÙŠØ«Ø§Ù‹",
    giftSets: "Ù…Ø¬Ù…ÙˆØ¹Ø§Øª Ø§Ù„Ù‡Ø¯Ø§ÙŠØ§",
    allRightsReserved: "Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ‚ Ù…Ø­ÙÙˆØ¸Ø©.",
    beautyShop: "Ù…ØªØ¬Ø± Ø§Ù„ØªØ¬Ù…ÙŠÙ„",

    // Pages
    exploreCollections: "Ø§Ø³ØªÙƒØ´Ù Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø§Øª",
    discoverBrands: "Ø§ÙƒØªØ´Ù Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©",
    topSellers: "Ø§Ù„Ø£ÙƒØ«Ø± Ù…Ø¨ÙŠØ¹Ø§Ù‹",
    specialOffers: "Ø¹Ø±ÙˆØ¶ Ø®Ø§ØµØ©",
    getInTouch: "ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§",
    loadingProducts: "Ø¬Ø§Ø±ÙŠ ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª...",
    noProductsFound: "Ù„Ù… ÙŠØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ù…Ù†ØªØ¬Ø§Øª",
    backToHome: "Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„Ø±Ø¦ÙŠØ³ÙŠØ©",
    productNotFound: "Ø§Ù„Ù…Ù†ØªØ¬ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯",
  },
};

interface LanguageContextType {
  language: Language;
  /** Alias for language â€” kept for backward compatibility */
  locale: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
  /** Alias for isRTL direction string */
  dir: "rtl" | "ltr";
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

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const base = "https://www.asperbeautyshop.com/";
    const arUrl = `${base}?lang=ar`;
    if (canonical) canonical.href = isRTL ? arUrl : base;

    // Update hreflang self-referencing
    const hrefEn = document.querySelector('link[hreflang="en"]') as HTMLLinkElement | null;
    const hrefAr = document.querySelector('link[hreflang="ar"]') as HTMLLinkElement | null;
    if (hrefEn) hrefEn.href = base;
    if (hrefAr) hrefAr.href = arUrl;

    // Update meta descriptions dynamically
    const enDesc = "Discover premium skincare and beauty products at Asper Beauty Shop. Curated luxury essentials for your daily beauty ritual.";
    const arDesc = "Ø§ÙƒØªØ´ÙÙŠ Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© ÙˆØ§Ù„Ø¬Ù…Ø§Ù„ Ø§Ù„ÙØ§Ø®Ø±Ø© ÙÙŠ Ø£Ø³Ø¨Ø± Ø¨ÙŠÙˆØªÙŠ Ø´ÙˆØ¨. Ù…Ø³ØªØ­Ø¶Ø±Ø§Øª ÙØ§Ø®Ø±Ø© Ù…Ù†ØªÙ‚Ø§Ø© Ø¨Ø¹Ù†Ø§ÙŠØ© Ù„Ø±ÙˆØªÙŠÙ† Ø¬Ù…Ø§Ù„Ùƒ Ø§Ù„ÙŠÙˆÙ…ÙŠ.";
    const desc = isRTL ? arDesc : enDesc;

    const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (metaDesc) metaDesc.content = desc;

    const ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    if (ogDesc) ogDesc.content = desc;

    const twDesc = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement | null;
    if (twDesc) twDesc.content = desc;

    // Update titles
    const enTitle = "Asper Beauty Shop | Luxury Skincare & Beauty Essentials";
    const arTitle = "Ø£Ø³Ø¨Ø± Ø¨ÙŠÙˆØªÙŠ Ø´ÙˆØ¨ | Ù…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© ÙˆØ§Ù„Ø¬Ù…Ø§Ù„ Ø§Ù„ÙØ§Ø®Ø±Ø©";
    const title = isRTL ? arTitle : enTitle;
    document.title = title;

    const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (ogTitle) ogTitle.content = title;

    const twTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement | null;
    if (twTitle) twTitle.content = title;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider
      value={{ language, locale: language, setLanguage, t: translations[language], isRTL, dir: isRTL ? "rtl" : "ltr" }}
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
