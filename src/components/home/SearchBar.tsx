import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2, Stethoscope, Package, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchProducts, normalizePrice, ShopifyProduct } from "@/lib/shopify";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Dynamic Placeholder Typing Effect ─── */
const PLACEHOLDER_PHRASES = [
  "Try searching for 'Acne'…",
  "Try searching for 'CeraVe'…",
  "Try searching for 'Sunscreen'…",
  "Try searching for 'Niacinamide'…",
  "Try searching for 'Moisturizer'…",
];

function useTypingPlaceholder() {
  const [text, setText] = useState("");
  const phraseIdx = useRef(0);
  const charIdx = useRef(0);
  const isDeleting = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const tick = () => {
      const phrase = PLACEHOLDER_PHRASES[phraseIdx.current];
      if (!isDeleting.current) {
        charIdx.current++;
        setText(phrase.slice(0, charIdx.current));
        if (charIdx.current === phrase.length) {
          // Pause before deleting
          timer.current = setTimeout(() => {
            isDeleting.current = true;
            tick();
          }, 2000);
          return;
        }
        timer.current = setTimeout(tick, 60 + Math.random() * 40);
      } else {
        charIdx.current--;
        setText(phrase.slice(0, charIdx.current));
        if (charIdx.current === 0) {
          isDeleting.current = false;
          phraseIdx.current = (phraseIdx.current + 1) % PLACEHOLDER_PHRASES.length;
          timer.current = setTimeout(tick, 400);
          return;
        }
        timer.current = setTimeout(tick, 30);
      }
    };
    timer.current = setTimeout(tick, 800);
    return () => clearTimeout(timer.current);
  }, []);

  return text;
}

/* ─── Concern Suggestions ─── */
const CONCERN_MAP: Record<string, { label: string; query: string }[]> = {
  dry: [{ label: "Dry Skin", query: "dry skin" }, { label: "Dehydration", query: "dehydration" }],
  acne: [{ label: "Acne-Prone Skin", query: "acne" }, { label: "Blemish Control", query: "blemish" }],
  oil: [{ label: "Oily Skin", query: "oily skin" }, { label: "Sebum Control", query: "sebum" }],
  aging: [{ label: "Anti-Aging", query: "anti aging" }, { label: "Fine Lines", query: "fine lines" }],
  pigment: [{ label: "Pigmentation", query: "pigmentation" }, { label: "Dark Spots", query: "dark spots" }],
  sensitive: [{ label: "Sensitive Skin", query: "sensitive" }, { label: "Redness Relief", query: "redness" }],
  sun: [{ label: "Sun Protection", query: "sunscreen" }, { label: "UV Defense", query: "spf" }],
};

function getConcernSuggestions(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return Object.entries(CONCERN_MAP)
    .filter(([key]) => key.startsWith(q) || q.includes(key))
    .flatMap(([, values]) => values)
    .slice(0, 3);
}

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const typingPlaceholder = useTypingPlaceholder();

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await fetchProducts(6, value);
        setResults(results);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const handleSelect = (handle: string) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    navigate(`/product/${handle}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setResults([]);
    }
  };

  const concerns = getConcernSuggestions(query);
  const hasDropdown = loading || results.length > 0 || (query.trim().length >= 2 && concerns.length > 0);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-background hover:border-accent/50 hover:shadow-maroon-glow transition-all text-sm text-muted-foreground"
      >
        <Search className="h-4 w-4 text-primary/50" />
        <span className="hidden sm:inline">Search 5,000+ products…</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-muted border border-border rounded">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={typingPlaceholder || "Search products, brands, ingredients…"}
            className="pl-10 pr-8 h-[50px] w-[300px] sm:w-[400px] text-sm rounded-full border-primary/20 bg-secondary font-body"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setResults([]); }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => { setOpen(false); setQuery(""); setResults([]); }}
          className="text-xs text-muted-foreground hover:text-foreground font-body"
        >
          Cancel
        </button>
      </form>

      {/* Categorized Dropdown */}
      <AnimatePresence>
        {hasDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full mt-2 left-0 w-[300px] sm:w-[400px] bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {/* Concerns Section */}
            {concerns.length > 0 && (
              <div className="px-4 pt-3 pb-2">
                <p className="text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-wider mb-2">Concerns</p>
                <div className="space-y-1">
                  {concerns.map((c) => (
                    <button
                      key={c.query}
                      onClick={() => { setOpen(false); navigate(`/products?q=${encodeURIComponent(c.query)}`); setQuery(""); setResults([]); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                      <Stethoscope className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-sm font-body text-foreground">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Products Section */}
            {(loading || results.length > 0) && (
              <div className={concerns.length > 0 ? "border-t border-border" : ""}>
                <div className="px-4 pt-3 pb-1">
                  <p className="text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-wider">Products</p>
                </div>
                {loading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  </div>
                )}
                {!loading && results.slice(0, 3).map((p) => {
                  const img = p.node.images.edges[0]?.node.url;
                  return (
                    <button
                      key={p.node.id}
                      onClick={() => handleSelect(p.node.handle)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-md bg-secondary overflow-hidden shrink-0 flex items-center justify-center">
                        {img ? (
                          <img src={img} alt="" className="h-full w-full object-contain p-0.5" />
                        ) : (
                          <Package className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-medium text-foreground truncate">{p.node.title}</p>
                        <p className="text-[11px] text-muted-foreground font-body">{p.node.vendor}</p>
                      </div>
                      <span className="text-sm font-body font-semibold text-primary shrink-0">
                        {normalizePrice(p.node.priceRange.minVariantPrice.amount).toFixed(2)} {p.node.priceRange.minVariantPrice.currencyCode}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Expert Advice Link */}
            {query.trim().length >= 2 && (
              <div className="border-t border-border px-4 py-3">
                <button
                  onClick={() => { setOpen(false); navigate("/intelligence"); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors text-left"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span className="text-sm font-body text-accent font-medium">
                    Ask Dr. Sami about "{query.trim()}"
                  </span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

